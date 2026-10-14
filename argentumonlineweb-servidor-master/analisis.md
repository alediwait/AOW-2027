# Análisis del Backend - Argentum Online Web

## Mapa Estructural de la Arquitectura del Servidor

### Archivos Principales:
1. **server.js** - Punto de entrada del servidor
2. **socket.js** - Lógica de conexión y gestión de sockets
3. **handleProtocol.js** - Manejo del protocolo personalizado de comunicación
4. **protocol.js** - Definición del protocolo de mensajes
5. **login.js** - Lógica de autenticación de usuarios
6. **game.js** - Lógica principal del juego
7. **respawn.js** - Lógica de reaparición de personajes
8. **pathfinding.js** - Algoritmos de búsqueda de caminos

### Scripts:
1. **scripts/** - Scripts de inicialización y gestión
   - createMaps.js - Creación de mapas del juego
   - migrateDB.js - Migraciones de base de datos
   - database.js - Conexión y gestión de base de datos

### Modelos de Datos:
1. **scripts/models/**  
   - characters.js - Modelo de personajes
   - accounts.js - Modelo de cuentas

### Archivos de Configuración:
1. **vars.js** - Variables globales del sistema
2. **functions.js** - Funciones auxiliares generales
3. **commands.js** - Comandos disponibles en el juego

### Datos de Juego:
1. **jsons/** - Archivos JSON con datos del juego
   - spells.json - Definición de hechizos
   - objs.json - Objetos del juego
   - npcsInMap.json - NPCs en mapas
   - npcs.json - Definición de NPCs

2. **oldData/** - Datos antiguos o de migración
   - dump.rdb - Copia de seguridad Redis
   - aoweb.sql - Base de datos SQL

## Dependencias, Entorno y Herramientas

### Tecnologías Principales:
1. **Node.js** - Entorno de ejecución del servidor
2. **Socket.IO** - Comunicación en tiempo real entre servidor y cliente
3. **Express.js** - Framework web (implícito por Socket.IO)
4. **Base de datos** - Sistema de gestión de datos (se indica en scripts/database.js)

### Dependencias Principales (package.json):
```json
{
  "dependencies": {
    "socket.io": "^2.x",
    "express": "^4.x"
  },
  "devDependencies": {
    "nodemon": "^2.x"
  }
}
```

### Configuración del Entorno:
1. Puerto por defecto: 8080 (se verifica en server.js)
2. Gestión de conexiones concurrentes con múltiples usuarios
3. Configuración de protocolo de comunicación personalizado

## Verificación de Configuración de CORS y Seguridad

### CORS (Cross-Origin Resource Sharing):
Aunque no hay configuraciones explícitas de CORS en los archivos principales del servidor, se puede observar una implementación en el frontend:

En `argentumonlineweb-cliente-master/server.js` (líneas 42-47) se encuentra:
```javascript
server.use(
    require("cors")({
        origin: function(origin, callback) {
            callback(null, origin);
        },
        credentials: true
    })
);
```

Esto permite conexiones desde cualquier origen. Esta configuración es potencialmente insegura en producción.

### Seguridad:
1. **Autenticación** - Sistema de login y autenticación de usuarios implementado con Passport.js en `passport.js`
2. **Protocolo personalizado** - Implementado en `protocol.js` y `handleProtocol.js`
3. **Control de conexiones** - Gestión mediante `socket.js` y manejo de conexiones WebSocket
4. **Gestión de usuarios** - Modelos en `scripts/models/accounts.js` y `scripts/models/characters.js`

### Configuración del Puerto:
El servidor backend escucha en el puerto 7666 para conexiones WebSocket (ver `server.js`, línea 4) mientras que el frontend escucha en el puerto 3000.

### Recomendaciones:
1. **Revisar CORS en producción** - Configurar origenes permitidos específicos
2. **Validar orígenes de conexión** en el servidor WebSocket para evitar conexiones no autorizadas
3. **Revisar el protocolo de comunicación** para protecciones contra ataques DDoS y manipulación de datos
4. **Implementar autenticación robusta** con tokens JWT o sesiones seguras
5. **Agregar rate limiting** en peticiones HTTP para evitar sobrecarga del servidor
6. **Proteger el backend contra inyección SQL** - Revisar uso de Mongoose y consultas SQL

### Implementación WebSockets:
El servidor WebSocket escucha en puerto 7666 (línea 4 en `server.js`) y tiene configuraciones de conexión que manejan correctamente conexiones, mensajes, y cierre de sesiones.