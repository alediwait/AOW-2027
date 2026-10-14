// Middleware de seguridad para el frontend
const SecurityMiddleware = {
  // Protección CSRF
  csrfProtection: (req, res, next) => {
    // Generar token CSRF si no existe
    if (!req.csrfToken) {
      req.csrfToken = SecurityManager.generateCSRFToken();
    }
    
    // Validar token si se envía uno
    if (req.method !== 'GET' && req.body) {
      const csrfToken = req.headers['x-csrf-token'] || req.body._csrf;
      if (!SecurityManager.validateCSRFToken(csrfToken, req.csrfToken)) {
        return res.status(403).json({ 
          error: 'CSRF token validation failed' 
        });
      }
    }
    
    next();
  },

  // Protección de rate limiting
  rateLimit: (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const identifier = `${clientIP}-${userAgent}`;
    
    if (SecurityManager.isRateLimited(identifier)) {
      return res.status(429).json({ 
        error: 'Too many requests, rate limit exceeded' 
      });
    }
    
    next();
  },

  // Protección XSS
  xssProtection: (req, res, next) => {
    // Sanitizar datos de entrada
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = SecurityManager.sanitizeInput(req.body[key]);
        }
      });
    }
    
    next();
  },

  // Validación de sesiones
  sessionValidation: (req, res, next) => {
    const token = req.headers['authorization'] || req.cookies['auth_token'];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Authentication required' 
      });
    }
    
    // Validar token
    const userAgent = req.headers['user-agent'];
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (!SecurityManager.validateToken(token, userAgent, clientIP)) {
      return res.status(401).json({ 
        error: 'Invalid session' 
      });
    }
    
    next();
  },

  // Headers de seguridad
  securityHeaders: (req, res, next) => {
    const securityHeaders = SecurityManager.getSecurityHeaders();
    
    Object.keys(securityHeaders).forEach(header => {
      res.setHeader(header, securityHeaders[header]);
    });
    
    next();
  },

  // Protección contra fuerza bruta
  bruteForceProtection: (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    // Verificar si IP está bloqueada por fuerza bruta
    if (SecurityManager.isRateLimited(clientIP, 5, 300000)) { // 5 intentos en 5 minutos
      return res.status(429).json({ 
        error: 'Account temporarily locked due to too many failed attempts' 
      });
    }
    
    next();
  }
};

export default SecurityMiddleware;