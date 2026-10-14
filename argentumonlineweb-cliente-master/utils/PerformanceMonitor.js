// Monitor de rendimiento del juego
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: 0,
      memory: 0,
      loadTime: 0,
      cacheHits: 0,
      cacheMisses: 0,
      activeConnections: 0
    };
    
    this.history = {
      fps: [],
      memory: [],
      loadTime: []
    };
    
    this.observers = [];
    this.isMonitoring = false;
  }

  // Iniciar monitoreo
  start() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.monitorLoop();
  }

  // Detener monitoreo
  stop() {
    this.isMonitoring = false;
  }

  // Bucle de monitoreo
  monitorLoop() {
    if (!this.isMonitoring) return;
    
    // Medir FPS
    const fps = this.calculateFPS();
    this.metrics.fps = fps;
    this.history.fps.push(fps);
    if (this.history.fps.length > 100) {
      this.history.fps.shift();
    }
    
    // Medir uso de memoria (si está disponible)
    if (performance.memory) {
      const memory = performance.memory.usedJSHeapSize / (1024 * 1024); // MB
      this.metrics.memory = memory;
      this.history.memory.push(memory);
      if (this.history.memory.length > 100) {
        this.history.memory.shift();
      }
    }
    
    // Notificar observadores
    this.notifyObservers();
    
    // Programar siguiente medición
    setTimeout(() => this.monitorLoop(), 1000);
  }

  // Calcular FPS
  calculateFPS() {
    // Esta es una implementación simulada
    // En producción, se usaría un método más preciso
    return Math.round(Math.random() * 30) + 30; // Simulación entre 30-60 FPS
  }

  // Obtener métricas actuales
  getMetrics() {
    return { ...this.metrics };
  }

  // Obtener historial
  getHistory() {
    return { ...this.history };
  }

  // Registrar observador
  addObserver(observer) {
    this.observers.push(observer);
  }

  // Notificar a todos los observadores
  notifyObservers() {
    this.observers.forEach(observer => {
      if (typeof observer === 'function') {
        observer(this.metrics);
      }
    });
  }

  // Verificar condiciones de rendimiento
  checkPerformanceConditions() {
    const conditions = {
      isSmooth: this.metrics.fps >= 50,
      memoryLow: this.metrics.memory < 50,
      optimal: this.metrics.fps >= 50 && this.metrics.memory < 50
    };
    
    return conditions;
  }

  // Obtener estado de optimización
  getOptimizationState() {
    const conditions = this.checkPerformanceConditions();
    
    if (conditions.isSmooth && conditions.memoryLow) {
      return 'optimal';
    } else if (!conditions.isSmooth) {
      return 'low-fps';
    } else if (!conditions.memoryLow) {
      return 'high-memory';
    }
    
    return 'unknown';
  }

  // Resetear métricas
  reset() {
    this.metrics = {
      fps: 0,
      memory: 0,
      loadTime: 0,
      cacheHits: 0,
      cacheMisses: 0
    };
    
    this.history = {
      fps: [],
      memory: [],
      loadTime: []
    };
  }
}

export default new PerformanceMonitor();