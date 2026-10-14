// Componente de protección de autenticación
class AuthenticationGuard {
  constructor() {
    this.allowedRoles = ['user', 'premium', 'admin'];
    this.sessionTimeout = 86400000; // 24 horas
  }

  // Verificar autenticación
  isAuthenticated(req, res, next) {
    try {
      const token = this.extractToken(req);
      
      if (!token) {
        return res.status(401).json({ 
          error: 'Authentication required' 
        });
      }
      
      // Validar token con SecurityManager
      const userAgent = req.headers['user-agent'];
      const clientIP = this.getClientIP(req);
      
      if (!SecurityManager.validateToken(token, userAgent, clientIP)) {
        return res.status(401).json({ 
          error: 'Invalid or expired session' 
        });
      }
      
      // Actualizar última actividad
      this.updateSessionActivity(token);
      
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(500).json({ 
        error: 'Internal authentication error' 
      });
    }
  }

  // Verificar permisos de rol
  hasRole(req, res, next, requiredRole) {
    try {
      const token = this.extractToken(req);
      
      if (!token) {
        return res.status(401).json({ 
          error: 'Authentication required' 
        });
      }
      
      // Obtener información de sesión
      const session = SecurityManager.sessionTokens.get(token);
      
      if (!session || !session.role) {
        return res.status(403).json({ 
          error: 'Access denied - insufficient permissions' 
        });
      }
      
      // Validar rol
      if (!this.allowedRoles.includes(session.role)) {
        return res.status(403).json({ 
          error: 'Access denied - invalid role' 
        });
      }
      
      // Verificar nivel de permiso
      if (!SecurityManager.hasPermission(session.role, requiredRole)) {
        return res.status(403).json({ 
          error: 'Access denied - insufficient permissions' 
        });
      }
      
      next();
    } catch (error) {
      console.error('Role validation error:', error);
      return res.status(500).json({ 
        error: 'Internal role validation error' 
      });
    }
  }

  // Middleware para proteger rutas específicas
  protectRoute(requiredPermissions = []) {
    return (req, res, next) => {
      // Primero verificar autenticación
      this.isAuthenticated(req, res, (authError) => {
        if (authError) return authError;
        
        // Si se requieren permisos específicos
        if (requiredPermissions.length > 0) {
          const hasRequiredPermission = requiredPermissions.some(permission => 
            SecurityManager.hasPermission(
              SecurityManager.sessionTokens.get(this.extractToken(req))?.role || 'user',
              permission
            )
          );
          
          if (!hasRequiredPermission) {
            return res.status(403).json({ 
              error: 'Access denied - insufficient permissions' 
            });
          }
        }
        
        next();
      });
    };
  }

  // Actualizar actividad de sesión
  updateSessionActivity(token) {
    const session = SecurityManager.sessionTokens.get(token);
    if (session) {
      session.lastAccess = Date.now();
    }
  }

  // Extraer token del request
  extractToken(req) {
    let token = null;
    
    // Buscar en headers
    if (req.headers['authorization']) {
      const authHeader = req.headers['authorization'];
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    // Buscar en cookies
    if (!token && req.cookies) {
      token = req.cookies['auth_token'];
    }
    
    // Buscar en parámetros
    if (!token && req.query) {
      token = req.query.token;
    }
    
    return token;
  }

  // Obtener IP del cliente
  getClientIP(req) {
    return (
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null)
    );
  }

  // Cerrar sesión
  logout(req, res) {
    try {
      const token = this.extractToken(req);
      
      if (token) {
        SecurityManager.sessionTokens.delete(token);
      }
      
      // Limpiar cookies
      res.clearCookie('auth_token');
      
      return res.status(200).json({ 
        message: 'Successfully logged out' 
      });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ 
        error: 'Internal logout error' 
      });
    }
  }

  // Renovar token
  refreshToken(req, res) {
    try {
      const token = this.extractToken(req);
      
      if (!token) {
        return res.status(401).json({ 
          error: 'Authentication required' 
        });
      }
      
      const userAgent = req.headers['user-agent'];
      const clientIP = this.getClientIP(req);
      
      // Validar sesión actual
      if (!SecurityManager.validateToken(token, userAgent, clientIP)) {
        return res.status(401).json({ 
          error: 'Invalid session' 
        });
      }
      
      // Generar nuevo token (simulación básica)
      const newToken = SecurityManager.generateSecureToken(userAgent, clientIP);
      
      // Actualizar sesión con nuevo token
      const session = SecurityManager.sessionTokens.get(token);
      if (session) {
        SecurityManager.sessionTokens.delete(token);
        SecurityManager.registerSession(newToken, session, userAgent, clientIP);
      }
      
      return res.status(200).json({ 
        token: newToken 
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      return res.status(500).json({ 
        error: 'Internal token refresh error' 
      });
    }
  }

  // Verificar seguridad del sistema
  getSecurityStatus() {
    return {
      sessionCount: SecurityManager.sessionTokens.size,
      activeConnections: SecurityManager.sessionTokens.size,
      securityReport: SecurityManager.getSecurityReport()
    };
  }
}

export default new AuthenticationGuard();