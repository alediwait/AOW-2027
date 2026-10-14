// with-zustand-store.js
import React from 'react'
import useGameStore from '../store'

export default function withZustandStore(Component) {
  function WithZustandStore(props) {
    // Aquí podrías hacer cualquier lógica adicional con Zustand
    return <Component {...props} />
  }
  
  WithZustandStore.getInitialProps = async (appProps) => {
    const componentProps = Component.getInitialProps 
      ? await Component.getInitialProps(appProps.ctx)
      : {}
    
    // Puedes agregar lógica de estado inicial aquí si es necesario
    return { ...appProps, ...componentProps }
  }
  
  return WithZustandStore
}