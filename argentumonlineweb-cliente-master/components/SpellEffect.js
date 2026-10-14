// Componente para efectos mágicos específicos
import React, { useEffect, useRef } from 'react';

const SpellEffect = ({ type, position, active = false }) => {
  const effectRef = useRef(null);

  // Tipos de hechizos con diferentes estilos
  const spellTypes = {
    fireball: {
      color: '#ff4500',
      size: 20,
      particles: 30
    },
    icebolt: {
      color: '#00bfff',
      size: 15,
      particles: 20
    },
    lightning: {
      color: '#ffff00',
      size: 10,
      particles: 40
    },
    heal: {
      color: '#00ff00',
      size: 12,
      particles: 15
    },
    explosion: {
      color: '#ff8c00',
      size: 25,
      particles: 50
    }
  };

  // Inicializar efecto cuando se active
  useEffect(() => {
    if (!active || !effectRef.current) return;

    const effect = effectRef.current;
    const config = spellTypes[type] || spellTypes.fireball;

    // Crear efecto visual basado en el tipo de hechizo
    const createParticles = () => {
      const particles = [];
      for (let i = 0; i < config.particles; i++) {
        const particle = document.createElement('div');
        particle.className = 'spell-particle';
        particle.style.position = 'absolute';
        particle.style.width = `${config.size}px`;
        particle.style.height = `${config.size}px`;
        particle.style.backgroundColor = config.color;
        particle.style.borderRadius = '50%';
        particle.style.left = `${position.x}px`;
        particle.style.top = `${position.y}px`;
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = 1001;
        
        // Animación de partícula
        const angle = (Math.random() * Math.PI * 2);
        const speed = 2 + Math.random() * 3;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        let x = position.x;
        let y = position.y;
        let opacity = 1;
        let life = 50; // frames de vida
        
        const animateParticle = () => {
          if (life <= 0) {
            particle.remove();
            return;
          }
          
          // Actualizar posición
          x += vx;
          y += vy;
          opacity -= 0.02;
          life--;
          
          particle.style.left = `${x}px`;
          particle.style.top = `${y}px`;
          particle.style.opacity = opacity;
          
          requestAnimationFrame(animateParticle);
        };
        
        animateParticle();
        effect.appendChild(particle);
      }
    };

    createParticles();

    // Limpiar después de un tiempo
    const cleanup = setTimeout(() => {
      if (effect.children.length > 0) {
        Array.from(effect.children).forEach(child => child.remove());
      }
    }, 3000);

    return () => {
      clearTimeout(cleanup);
      if (effect.children.length > 0) {
        Array.from(effect.children).forEach(child => child.remove());
      }
    };
  }, [active, type, position]);

  return (
    <div 
      ref={effectRef} 
      className="spell-effect-container"
      style={{ 
        position: 'absolute', 
        left: position.x, 
        top: position.y,
        pointerEvents: 'none',
        zIndex: 1001
      }}
    />
  );
};

export default SpellEffect;