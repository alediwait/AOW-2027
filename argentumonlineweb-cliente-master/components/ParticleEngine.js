// Componente del motor de partículas para efectos visuales
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

const ParticleEngine = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Configuración inicial
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Establecer dimensiones del canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    setIsInitialized(true);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Crear partícula
  const createParticle = (x, y, type = 'default') => {
    const particle = {
      x,
      y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 100,
      maxSize: Math.random() * 5 + 2,
      type,
      color: getColorByType(type)
    };
    
    particlesRef.current.push(particle);
  };

  // Obtener color por tipo de partícula
  const getColorByType = (type) => {
    switch (type) {
      case 'fire': return '#ff4500';
      case 'ice': return '#00bfff';
      case 'lightning': return '#ffff00';
      case 'heal': return '#00ff00';
      case 'explosion': return '#ff8c00';
      default: return '#ffffff';
    }
  };

  // Dibujar partículas
  const drawParticles = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Limpiar canvas con transparencia para efecto de colisión
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particlesRef.current.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 1;
      
      if (particle.life <= 0 || 
          particle.x < 0 || particle.x > canvas.width ||
          particle.y < 0 || particle.y > canvas.height) {
        particlesRef.current.splice(index, 1);
        return;
      }
      
      // Dibujar partícula según tipo
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.maxSize * (particle.life / 100), 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
    });
    
    animationRef.current = requestAnimationFrame(drawParticles);
  };

  // Iniciar animación si está inicializado
  useEffect(() => {
    if (isInitialized) {
      drawParticles();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInitialized]);

  // Método público para crear efectos
  const createEffect = (x, y, type, count = 10) => {
    for (let i = 0; i < count; i++) {
      createParticle(x, y, type);
    }
  };

  // Crear efecto de hechizo cuando se active
  const createSpellEffect = (x, y, spellType) => {
    switch (spellType) {
      case 'fireball':
        createEffect(x, y, 'fire', 30);
        break;
      case 'icebolt':
        createEffect(x, y, 'ice', 20);
        break;
      case 'lightning':
        createEffect(x, y, 'lightning', 40);
        break;
      case 'heal':
        createEffect(x, y, 'heal', 15);
        break;
      default:
        createEffect(x, y, 'default', 10);
    }
  };

  // Función para crear efectos de impacto
  const createImpact = (x, y) => {
    createEffect(x, y, 'explosion', 50);
  };

  return (
    <div className="particle-engine-container">
      <canvas 
        ref={canvasRef} 
        className="particle-canvas" 
        style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 1000 }}
      />
    </div>
  );
};

export default ParticleEngine;