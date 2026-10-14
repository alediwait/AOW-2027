import React, { useEffect } from 'react';
import useStore from '../store/index';

// Este es un componente dummy que permite usar Zustand sin Provider
// En una implementación real de Zustand con Next.js, podrías usar el patrón:
// https://github.com/pmndrs/zustand#nextjs

const withZustandStore = (Component) => {
  const WithZustandStore = (props) => {
    // Usamos el store directamente en el componente
    const store = useStore();
    
    return <Component {...props} store={store} />;
  };

  return WithZustandStore;
};

export default withZustandStore;