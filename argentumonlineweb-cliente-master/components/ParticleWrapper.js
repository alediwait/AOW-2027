// Wrapper para el sistema de partículas
import React, { useEffect, useRef } from 'react';
import ParticleEngine from './ParticleEngine';

const ParticleWrapper = ({ children }) => {
  const engineRef = useRef(null);

  // Funciones públicas que pueden ser llamadas desde otros componentes
  const createSpellEffect = (x, y, spellType) => {
    if (engineRef.current && engineRef.current.createSpellEffect) {
      engineRef.current.createSpellEffect(x, y, spellType);
    }
  };

  const createImpact = (x, y) => {
    if (engineRef.current && engineRef.current.createImpact) {
      engineRef.current.createImpact(x, y);
    }
  };

  // Crear efectos de movimiento
  const createMovementEffect = (x, y, count = 5) => {
    if (engineRef.current && engineRef.current.createEffect) {
      engineRef.current.createEffect(x, y, 'movement', count);
    }
  };

  return (
    <div className="particle-wrapper">
      <ParticleEngine ref={engineRef} />
      {children}
    </div>
  );
};

export default ParticleWrapper;