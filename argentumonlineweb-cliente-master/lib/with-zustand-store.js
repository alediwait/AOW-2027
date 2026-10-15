// with-zustand-store.js
import React from 'react'
import useGameStore from '../store'

export default function withZustandStore(Component) {
  function WithZustandStore(props) {
    // Aquí puedes usar o inicializar tu store de Zustand si lo requieres
    return <Component {...props} />
  }
  
  WithZustandStore.getInitialProps = async (appContext) => {
    // 1. Ejecutamos el getInitialProps del componente envuelto si existe
    const componentProps = Component.getInitialProps 
      ? await Component.getInitialProps(appContext.ctx)
      : {}
    
    // 2. Retornamos únicamente un objeto plano con las propiedades de la página,
    // evitando por completo retornar appProps o referencias circulares.
    return { 
      ...(componentProps || {}) 
    }
  }
  
  return WithZustandStore
}