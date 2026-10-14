// Configuración de optimización del rendimiento
export const OptimizationConfig = {
  // Límites de caché
  cache: {
    maxSize: 100, // Máximo número de elementos en caché
    maxAge: 3600000, // Tiempo máximo de vida (1 hora)
    persistence: true // Si se debe persistir entre sesiones
  },
  
  // Parámetros de carga
  loading: {
    maxConcurrent: 5,           // Máximo número de cargas concurrentes
    chunkSize: 1024 * 1024,     // Tamaño de chunk para streaming (1MB)
    progressInterval: 100,      // Intervalo de progreso en ms
    timeout: 10000              // Timeout por defecto en ms
  },
  
  // Estrategias de optimización
  strategies: {
    lazyLoad: true,             // Carga diferida de componentes
    streaming: true,            // Streaming de grandes recursos
    compression: true,          // Compresión de imágenes
    prefetching: true,          // Prefetch de recursos futuros
    memoryManagement: true      // Gestión de memoria
  },
  
  // Recursos críticos para pre-carga
  criticalResources: [
    {
      key: 'game-assets',
      url: '/api/assets/manifest.json',
      type: 'json',
      priority: 'high'
    },
    {
      key: 'player-sprites',
      url: '/assets/sprites/player.png',
      type: 'image',
      priority: 'high'
    },
    {
      key: 'map-tiles',
      url: '/assets/maps/tiles.json',
      type: 'json',
      priority: 'normal'
    }
  ],
  
  // Métricas de rendimiento
  performance: {
    targetFPS: 60,
    memoryThreshold: 50,        // Umbral de memoria en MB para optimización
    throttleFactor: 0.8         // Factor de throttling para evitar sobrecarga
  },
  
  // Configuración por tipo de recurso
  resourceTypes: {
    image: {
      format: 'webp',           // Formato preferido
      quality: 80,              // Calidad de compresión
      lazyLoad: true            // Carga diferida
    },
    audio: {
      format: 'mp3',            // Formato preferido
      preload: 'metadata',      // Pre-carga de metadatos
      cache: true               // Caché activa
    },
    data: {
      compression: true,        // Compresión gzip
      cache: true,              // Caché activa
      ttl: 3600000              // Tiempo de vida en ms
    }
  }
};

// Función para obtener configuración por tipo de recurso
export const getResourceConfig = (type) => {
  return OptimizationConfig.resourceTypes[type] || 
         OptimizationConfig.resourceTypes.data;
};

// Verificar si una optimización está habilitada
export const isOptimizationEnabled = (strategy) => {
  return OptimizationConfig.strategies[strategy] === true;
};

// Obtener límites de carga
export const getLoadLimits = () => {
  return {
    concurrent: OptimizationConfig.loading.maxConcurrent,
    chunkSize: OptimizationConfig.loading.chunkSize
  };
};