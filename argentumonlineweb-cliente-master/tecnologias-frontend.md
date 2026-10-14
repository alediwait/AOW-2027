# Tecnologías del Frontend - Argentum Online Web

## Framework y Librerías Principales

1. **Next.js** - Framework React basado en Server-Side Rendering para la aplicación web
2. **React** - Biblioteca para construir interfaces de usuario componentes
3. **Redux** - Manejo del estado global de la aplicación
4. **React Redux** - Integración entre React y Redux

## Estilos y Presentación

1. **SASS/SCSS** - Preprocesador CSS para estilos avanzados y modularizados
2. **CSS Modules** - Para el aislamiento de estilos y evitar conflictos
3. **Font Awesome** - Biblioteca de íconos para la interfaz de usuario

## Gestión de Recursos Estáticos

1. **Public folder** - Para recursos estáticos como imágenes (en `public/static/spells/`)
2. **Componentes reutilizables** - Organizados en carpetas:
   - Header
   - Login form
   - Character creation
   - Main container

## Gestión de Estado

1. **Redux Store** - Para el manejo del estado de la aplicación
2. **withReduxStore** - HOC (Higher Order Component) que conecta Next.js con Redux

## Funcionalidades Específicas

1. **Gestión de sesiones** - Mediante cookie-session y express-session
2. **Autenticación** - Con Passport.js para autenticación local
3. **Manejo de rutas** - Router interno basado en Next.js
4. **Comunicación HTTP** - Axios para peticiones API
5. **Responsive Design** - Adecuado para diferentes tamaños de pantalla

## Configuración del Entorno

1. **Webpack** - Para el empaquetado y construcción del frontend (configurado en next.config.js)
2. **Nodemon** - Para desarrollo con recarga automática
3. **Hot Reloading** - Soporte para actualización en tiempo real durante desarrollo

## Características Técnicas

La aplicación está estructurada como una SPA (Single Page Application) con Server-Side Rendering (SSR) gracias a Next.js, lo que mejora el SEO y el rendimiento inicial. La interfaz gráfica incluye componentes reutilizables que gestionan aspectos como:
- Sistema de navegación
- Formularios de login y registro
- Pantallas de creación de personajes  
- Vista de ranking
- Componentes de estilo reutilizables (header, footer)

La gestión de los estilos utiliza SCSS con CSS Modules, lo que permite modularizar los estilos sin conflictos y mejora mantenibilidad.