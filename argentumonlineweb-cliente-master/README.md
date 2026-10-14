# Argentum Online Web - Frontend

Este es el frontend del juego Argentum Online Web, construido con Next.js y React.

## Estructura del Proyecto

- `components/` - Componentes reutilizables de la interfaz
- `pages/` - Páginas principales de la aplicación
- `styles/` - Estilos globales (SASS)
- `store/` - Gestión del estado global con Zustand (nueva implementación)
- `config/` - Configuraciones del sistema

## Configuración Inicial

Para instalar las dependencias:

```bash
npm install
```

## Comandos Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Crear una versión optimizada para producción
- `npm start` - Ejecutar la aplicación en producción

## Implementación de Zustand

### Reemplazo de Redux

Se ha implementado Zustand como alternativa a Redux con las siguientes características:

1. **Gestión simplificada del estado**
2. **Mejores rendimiento para estados complejos de juego**
3. **Compatibilidad total con el backend existente**

### Estructura del Store

El store se encuentra en `store/index.js` y contiene:
- Estado global del jugador
- Listado de personajes
- Estado del mapa
- Funciones de actualización del estado

## Sistema de Partículas (Etapa 2)

### Implementación de Particle.js

Se ha implementado un sistema de partículas para efectos visuales en el juego:

1. **Efectos de magia**:
   - Hechizos de fuego
   - Rayos de hielo
   - Impactos de electricidad
   - Efectos de curación
   - Explosiones

2. **Componentes principales**:
   - `ParticleEngine.js` - Motor principal de partículas
   - `SpellEffect.js` - Componente para efectos mágicos específicos
   - `ParticleWrapper.js` - Wrapper que envuelve el sistema de partículas
   - `particle-config.js` - Configuración global del sistema

3. **Capacidades**:
   - Efectos dinámicos en tiempo real
   - Integración con eventos del juego (combates, movimientos)
   - Gestión eficiente del rendimiento
   - Sistema escalable de partículas

## Ejemplo de Uso

```javascript
import ParticleWrapper from '../components/ParticleWrapper';

function GameArea() {
  const handleSpellCast = () => {
    // Crear efecto de hechizo en posición específica
    particleWrapper.createSpellEffect(100, 200, 'fireball');
  };

  return (
    <ParticleWrapper>
      <div className="game-content">
        {/* Contenido del juego */}
      </div>
    </ParticleWrapper>
  );
}
```

### Integración con Componentes

Los componentes pueden usar el store de esta manera:

```javascript
import useGameStore from '../store'

function MyComponent() {
  const user = useGameStore(state => state.user)
  const setUser = useGameStore(state => state.setUser)
  
  // Uso de las funciones del store...
}
```
