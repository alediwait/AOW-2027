// Cargador de recursos optimizado con streaming
class ResourceLoader {
  constructor() {
    this.streamBuffer = new Map();
    this.chunkSize = 1024 * 1024; // 1MB por chunk
    this.maxConcurrentLoads = 3;
    this.activeLoads = 0;
    this.loadQueue = [];
  }

  // Cargar recurso en chunks (streaming)
  async loadStreamingResource(url, options = {}) {
    const { onProgress, onError } = options;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentLength = response.headers.get('content-length');
      const totalSize = contentLength ? parseInt(contentLength) : 0;
      
      const reader = response.body.getReader();
      const chunks = [];
      let receivedLength = 0;
      let done = false;
      
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        
        if (value) {
          chunks.push(value);
          receivedLength += value.length;
          
          // Llamar callback de progreso si existe
          if (onProgress && totalSize > 0) {
            onProgress({
              loaded: receivedLength,
              total: totalSize,
              progress: receivedLength / totalSize
            });
          }
        }
      }
      
      // Fusionar todos los chunks
      const blob = new Blob(chunks);
      return await this.processResource(blob, url);
    } catch (error) {
      if (onError) onError(error);
      throw error;
    }
  }

  // Procesar recursos después de carga
  async processResource(blob, url) {
    const extension = url.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'json':
        return await blob.text();
      case 'png':
      case 'jpg':
      case 'jpeg':
        return URL.createObjectURL(blob);
      default:
        return blob;
    }
  }

  // Carga concurrente limitada
  async loadWithConcurrency(urls, maxConcurrent = this.maxConcurrentLoads) {
    const results = [];
    const queue = urls.map(url => ({ url }));
    
    while (queue.length > 0) {
      const batch = queue.splice(0, maxConcurrent);
      
      const batchPromises = batch.map(async item => {
        try {
          const resource = await this.loadStreamingResource(item.url);
          results.push({ url: item.url, resource, error: null });
        } catch (error) {
          results.push({ url: item.url, resource: null, error });
        }
      });
      
      await Promise.allSettled(batchPromises);
    }
    
    return results;
  }

  // Cargar recursos de manera diferida
  lazyLoadResource(url, options = {}) {
    return new Promise((resolve, reject) => {
      const load = () => {
        this.loadStreamingResource(url, options)
          .then(resolve)
          .catch(reject);
      };
      
      // Si hay carga activa, esperar un poco y volver a intentarlo
      if (this.activeLoads >= this.maxConcurrentLoads) {
        setTimeout(load, 100);
      } else {
        load();
      }
    });
  }

  // Obtener estado de carga actual
  getLoadStatus() {
    return {
      activeLoads: this.activeLoads,
      queueLength: this.loadQueue.length,
      maxConcurrent: this.maxConcurrentLoads
    };
  }

  // Establecer límites de carga
  setLoadLimits(maxConcurrent = 3, chunkSize = 1024 * 1024) {
    this.maxConcurrentLoads = maxConcurrent;
    this.chunkSize = chunkSize;
  }
}

export default new ResourceLoader();