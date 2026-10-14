# Plan de Mejora del Frontend - Etapa 1: Zustand

## Objetivo
Reemplazar Redux por Zustand para mejorar el manejo del estado global del juego con menor overhead y mejor rendimiento.

## Pasos Ejecutivos

### Paso 1: Actualización de Dependencias

Editar `package.json` y agregar:
```json
"dependencies": {
  // ... otras dependencias
  "zustand": "^4.0.0"
}
```

### Paso 2: Crear el Store de Zustand

Crear el archivo `store/index.js` con el siguiente contenido:

```javascript
// Store centralizado con Zustand
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Store del juego
const useGameStore = create(
  devtools(
    (set, get) => ({
      // Estado global del juego
      user: null,
      isLoggedIn: false,
      characters: [],
      currentCharacter: null,
      gameMap: null,
      isLoaded: false,
      
      // Acciones
      setUser: (user) => set({ user, isLoggedIn: !!user }),
      setCurrentCharacter: (character) => set({ currentCharacter: character }),
      setCharacters: (characters) => set({ characters }),
      setGameMap: (map) => set({ gameMap: map }),
      setIsLoaded: (loaded) => set({ isLoaded: loaded }),
      
      // Acciones de juego
      updateCharacterPosition: (characterId, newPosition) => {
        set((state) => ({
          characters: state.characters.map(char => 
            char.id === characterId ? { ...char, position: newPosition } : char
          )
        }))
      },
      
      updateCharacterHealth: (characterId, newHealth) => {
        set((state) => ({
          characters: state.characters.map(char => 
            char.id === characterId ? { ...char, health: newHealth } : char
          )
        }))
      },
      
      addMessage: (message) => {
        set((state) => ({
          messages: [...state.messages, message]
        }))
      },
      
      clearMessages: () => set({ messages: [] }),
      
      // Estado de juego actual
      gameState: {
        isPlaying: false,
        isPaused: false,
        currentArea: null,
        lastUpdated: null
      },
      
      updateGameState: (newState) => set((state) => ({
        gameState: { ...state.gameState, ...newState }
      }))
    }),
    { name: 'game-store' }
  )
)

export default useGameStore
```

### Paso 3: Actualización de _app.js

Reemplazar el contenido de `pages/_app.js`:

```javascript
import App, { Container } from "next/app";
import React from "react";
import withZustandStore from "../lib/with-zustand-store";
import Head from "../components/Head";

import "@fortawesome/fontawesome-svg-core/styles.css";
import "../styles/style.scss";

import { config as configFA } from "@fortawesome/fontawesome-svg-core";
configFA.autoAddCss = false;

import { fetchUrl, routerPush } from "../config/utils";

class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        if (ctx.req) {
            const account = await fetchUrl("/checkuserlogged", {
                credentials: "include",
                headers: { cookie: ctx.req.headers.cookie }
            });

            if (ctx.req.url == "/createCharacter" && !account.logged) {
                ctx.res.writeHead(302, {
                    Location: "/register"
                });
                ctx.res.end();
                return (ctx.res.finished = true);
            }

            return { pageProps, account: account };
        }

        return { pageProps, account: {} };
    }

    render() {
        const { Component, pageProps } = this.props;
        return (
            <React.Fragment>
                <Head />
                <Component {...pageProps} />
            </React.Fragment>
        );
    }
}

export default withZustandStore(MyApp);
```

### Paso 4: Crear withZustandStore

Crear el archivo `lib/with-zustand-store.js`:

```javascript
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
```

## Próximos Pasos

Una vez completada esta etapa, se podrá:
1. Probar que la aplicación sigue funcionando correctamente
2. Reemplazar los componentes que usaban Redux por los que usan Zustand
3. Proceder con la segunda etapa: implementación de Particle.js

## Verificación

Para verificar el correcto funcionamiento:
1. Ejecutar `npm install` para instalar las nuevas dependencias
2. Iniciar la aplicación con `npm run dev`
3. Comprobar que no hay errores en la consola del navegador
4. Verificar que todas las funcionalidades de login y navegación siguen funcionando

## Impacto

- **Menor overhead**: Zustand tiene un tamaño significativamente menor que Redux
- **Mejor rendimiento**: Manejo más eficiente del estado complejo en tiempo real
- **Compatibilidad**: El sistema mantiene la compatibilidad completa con el backend existente