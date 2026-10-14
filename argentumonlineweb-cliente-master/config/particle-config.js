// Configuración global del sistema de partículas
export const ParticleConfig = {
  // Configuraciones generales
  canvas: {
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  
  // Tipos de partículas predefinidas
  particleTypes: {
    default: {
      maxLife: 100,
      maxSize: 3,
      minSize: 1,
      gravity: 0.1,
      friction: 0.98,
      color: '#ffffff'
    },
    
    fire: {
      maxLife: 80,
      maxSize: 6,
      minSize: 2,
      gravity: 0.05,
      friction: 0.97,
      color: '#ff4500',
      glow: true
    },
    
    ice: {
      maxLife: 120,
      maxSize: 4,
      minSize: 1,
      gravity: 0.02,
      friction: 0.99,
      color: '#00bfff'
    },
    
    lightning: {
      maxLife: 60,
      maxSize: 3,
      minSize: 1,
      gravity: 0.01,
      friction: 0.95,
      color: '#ffff00',
      pulse: true
    },
    
    heal: {
      maxLife: 100,
      maxSize: 5,
      minSize: 2,
      gravity: 0.03,
      friction: 0.98,
      color: '#00ff00'
    },
    
    explosion: {
      maxLife: 60,
      maxSize: 8,
      minSize: 1,
      gravity: 0.1,
      friction: 0.95,
      color: '#ff8c00'
    }
  },
  
  // Configuraciones de efectos
  effects: {
    spell: {
      particleCount: 20,
      spread: 30,
      duration: 2000
    },
    
    impact: {
      particleCount: 50,
      spread: 50,
      duration: 1500
    },
    
    movement: {
      particleCount: 5,
      spread: 10,
      duration: 1000
    }
  },
  
  // Control de rendimiento
  performance: {
    maxParticles: 300,
    fpsLimit: 60,
    autoCleanup: true
  }
};

// Función para obtener configuración por tipo
export const getParticleConfig = (type) => {
  return ParticleConfig.particleTypes[type] || ParticleConfig.particleTypes.default;
};

// Función para crear partícula según tipo
export const createParticleFromType = (x, y, type = 'default') => {
  const config = getParticleConfig(type);
  return {
    x,
    y,
    vx: (Math.random() - 0.5) * 10,
    vy: (Math.random() - 0.5) * 10,
    life: config.maxLife,
    maxSize: config.maxSize,
    minSize: config.minSize,
    gravity: config.gravity,
    friction: config.friction,
    color: config.color,
    type
  };
};