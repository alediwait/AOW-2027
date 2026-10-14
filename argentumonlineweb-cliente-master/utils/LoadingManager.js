// Gestor de carga y optimización del rendimiento
class LoadingManager {
  constructor() {
    this.cache = new Map();
    this.loadingQueue = [];
    this.loadedAssets = new Set();
    this.performance = {
      loadTime: 0,
      cacheHits: 0,
      cacheMisses: 0,
      memoryUsage: 0
    };
  }

  // Verificar si un recurso está en caché
  isCached(key) {
    return this.cache.has(key);
  }

  // Obtener recurso desde caché o cargarlo
  async getCachedResource(key, loaderFn, options = {}) {
    const startTime = performance.now();
    
    if (this.cache.has(key)) {
      this.performance.cacheHits++;
      console.log(`[CACHE] Hit for: ${key}`);
      return this.cache.get(key);
    }
    
    this.performance.cacheMisses++;
    console.log(`[LOAD] Loading: ${key}`);
    
    try {
      const resource = await loaderFn();
      this.cache.set(key, resource);
      
      // Limpiar caché si excede el límite
      if (this.cache.size > options.maxCacheSize || options.maxCacheSize) {
        const keysToRemove = Array.from(this.cache.keys()).slice(0, 10);
        keysToRemove.forEach(key => this.cache.delete(key));
      }
      
      const loadTime = performance.now() - startTime;
      this.performance.loadTime += loadTime;
      
      return resource;
    } catch (error) {
      console.error(`[ERROR] Failed to load ${key}:`, error);
      throw error;
    }
  }

  // Carga diferida (lazy loading)
  lazyLoad(key, loaderFn, priority = 'normal') {
    const task = {
      key,
      loaderFn,
      priority,
      timestamp: Date.now()
    };
    
    this.loadingQueue.push(task);
    
    // Procesar cola según prioridad
    if (priority === 'high') {
      this.processQueue();
    }
    
    return new Promise((resolve, reject) => {
      const checkReady = () => {
        if (this.cache.has(key)) {
          resolve(this.cache.get(key));
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    });
  }

  // Procesar cola de carga
  async processQueue() {
    this.loadingQueue.sort((a, b) => {
      const priorityOrder = { high: 3, normal: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    while (this.loadingQueue.length > 0) {
      const task = this.loadingQueue.shift();
      try {
        await this.getCachedResource(task.key, task.loaderFn);
      } catch (error) {
        console.error(`Failed to process queue item ${task.key}:`, error);
      }
    }
  }

  // Obtener métricas de rendimiento
  getPerformanceMetrics() {
    return {
      ...this.performance,
      cacheHitRate: this.performance.cacheHits / 
                   (this.performance.cacheHits + this.performance.cacheMisses || 1),
      totalCacheSize: this.cache.size
    };
  }

  // Limpiar caché
  clearCache() {
    this.cache.clear();
    this.loadedAssets.clear();
    this.performance = {
      loadTime: 0,
      cacheHits: 0,
      cacheMisses: 0,
      memoryUsage: 0
    };
  }

  // Pre-cargar recursos importantes
  async preloadCriticalResources(resources) {
    const promises = resources.map(async resource => {
      try {
        return await this.getCachedResource(
          resource.key, 
          resource.loader, 
          { maxCacheSize: 50 }
        );
      } catch (error) {
        console.error(`Failed to preload ${resource.key}:`, error);
      }
    });
    
    return Promise.allSettled(promises);
  }
}

export default new LoadingManager();