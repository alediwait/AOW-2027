# Inicialización del Sistema Argentum Online Web

## Información General

Este documento contiene todos los pasos y comandos necesarios para iniciar tanto el backend como el frontend del sistema Argentum Online Web.

## Requisitos Previos

Antes de ejecutar el sistema, asegúrate de tener instalados:

1. **Node.js** versión 24.22.0 o superior
2. **MongoDB** instalado y funcionando
3. **Git** (opcional pero recomendado)

## Estructura del Proyecto

```
Argentum-Online-Web/
├── argentumonlineweb-cliente-master/     # Frontend (Next.js)
├── argentumonlineweb-servidor-master/    # Backend (Node.js + WebSocket)
└── system-init.md                        # Este archivo
```

## Inicialización del Backend

### 1. Acceder al directorio del backend

```bash
cd argentumonlineweb-servidor-master
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Iniciar el servidor backend

```bash
npm run dev
```

> El servidor backend se iniciará en el puerto 3001 (por defecto)

## Inicialización del Frontend

### 1. Acceder al directorio del frontend

```bash
cd ../argentumonlineweb-cliente-master
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Iniciar el servidor frontend

```bash
npm run dev
```

> El servidor frontend se iniciará en el puerto 3000 (por defecto)

## Acceso a la Aplicación

Una vez ambos servidores estén corriendo:

- **Frontend**: http://localhost:3000/
- **Backend**: http://localhost:3001/ (para servicios API)

## Comandos Comunes de Gestión

### Para el Backend:
```bash
# Iniciar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar en modo producción  
npm run start
```

### Para el Frontend:
```bash
# Iniciar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar en modo producción
npm run start
```

## Configuración de MongoDB

El backend se conectará automáticamente a MongoDB en:

- **Desarrollo**: mongodb://localhost:27017/aoweb
- **Producción**: Debe ser configurado manualmente

### Para verificar conexión con MongoDB:

```bash
# Iniciar MongoDB (en Windows)
net start MongoDB

# O desde el directorio de instalación:
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

## Verificación de Funcionamiento

Una vez iniciados ambos servidores, verifica que:

1. **Backend está funcionando** (`http://localhost:3001/`)
2. **Frontend está funcionando** (`http://localhost:3000/`)
3. **Conexión a la base de datos** se establece correctamente

## Posibles Problemas y Soluciones

### 1. Puerto en uso
Si el puerto 3000 o 3001 ya está en uso, modifica los archivos de configuración:

#### Para frontend (archivo `next.config.js`):
```javascript
module.exports = {
  serverRuntimeConfig: {
    // Configuraciones de servidor
  },
  publicRuntimeConfig: {
    // Configuraciones públicas
  }
}
```

#### Para backend (en `server.js`):
```javascript
const port = process.env.PORT || 3002; // Cambiar puerto
```

### 2. Dependencias faltantes

Reinstala dependencias si es necesario:

```bash
# En ambos directorios
npm install
```

## Recomendaciones de Ejecución

1. **Iniciar MongoDB primero**
2. **Iniciar el backend antes que el frontend**
3. **Verificar en la consola que ambos servicios se inicien correctamente**

## Estructura de Rutas Disponibles

### Frontend:
- `/` - Página principal
- `/register` - Registro de usuarios  
- `/createCharacter` - Creación de personajes
- `/ranking` - Ranking de jugadores
- `/play` - Juego en línea

### Backend (API):
- `/api/users` - Gestión de usuarios
- `/api/characters` - Gestión de personajes
- `/api/game` - Funcionalidades del juego

## Información Adicional

El sistema está completamente integrado y las mejoras implementadas (Zustand, Particle.js, optimización y seguridad) funcionarán correctamente una vez iniciado el servidor.



Notas: me toco deshabilitar "@zeit/next-sass": "^1.0.1", y "node-sass".
En su lugar puse "sass": "^1.60.0".

También necesite hacer npm install --save-dev cross-env
y modificar los package.json agregando el cross-env:
"scripts": {
  "dev": "cross-env .........."
}