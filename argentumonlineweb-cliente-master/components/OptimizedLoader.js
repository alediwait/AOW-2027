// Componente optimizado para carga de recursos del juego
import React, { useState, useEffect } from 'react';
import LoadingManager from '../utils/LoadingManager';
import ResourceLoader from '../utils/ResourceLoader';

const OptimizedLoader = ({ children, criticalResources = [] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  // Cargar recursos críticos al iniciar
  useEffect(() => {
    const loadCriticalResources = async () => {
      try {
        if (criticalResources.length > 0) {
          setIsLoading(true);
          
          // Pre-cargar recursos críticos con progreso
          const results = await LoadingManager.preloadCriticalResources(
            criticalResources.map(res => ({
              key: res.key,
              loader: async () => {
                // Esto es una simulación - en producción se usaría el ResourceLoader real
                return new Promise(resolve => {
                  setTimeout(() => resolve({ loaded: true, data: res }), 500);
                });
              }
            }))
          );
          
          // Actualizar progreso
          setProgress(100);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    loadCriticalResources();
  }, []);

  // Componente de carga
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-progress">
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }}
          ></div>
          <span>Cargando juego... {progress}%</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error de Carga</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }

  return <div className="optimized-loader">{children}</div>;
};

export default OptimizedLoader;