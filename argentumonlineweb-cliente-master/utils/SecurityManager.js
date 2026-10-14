// Gestor de seguridad del juego
class SecurityManager {
  constructor() {
    this.sessionTokens = new Map();
    this.ratelimiters = new Map();
    this.securityHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
    };
    this.isSecure = true;
  }

  // Generar token seguro
  generateSecureToken(userAgent, ipAddress) {
    const timestamp = Date.now();
    const tokenData = `${userAgent}-${ipAddress}-${timestamp}`;
    return this.hashString(tokenData);
  }

  // Validar token
  validateToken(token, userAgent, ipAddress) {
    try {
      const session = this.sessionTokens.get(token);
      if (!session) return false;
      
      // Verificar tiempo de expiración (24 horas)
      if (Date.now() - session.createdAt > 86400000) {
        this.sessionTokens.delete(token);
        return false;
      }
      
      // Verificar correspondencia de IP y userAgent
      if (session.ipAddress !== ipAddress || session.userAgent !== userAgent) {
        console.warn('Security alert: Token validation failed - IP/UserAgent mismatch');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  // Hash de cadenas (simulación básica)
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  // Implementar rate limiting
  isRateLimited(key, maxRequests = 100, timeWindow = 3600000) {
    const now = Date.now();
    
    if (!this.ratelimiters.has(key)) {
      this.ratelimiters.set(key, {
        requests: [],
        windowStart: now
      });
    }
    
    const limiter = this.ratelimiters.get(key);
    
    // Limpiar solicitudes antiguas
    limiter.requests = limiter.requests.filter(
      timestamp => now - timestamp < timeWindow
    );
    
    // Comprobar límite
    if (limiter.requests.length >= maxRequests) {
      return true;
    }
    
    // Registrar nueva solicitud
    limiter.requests.push(now);
    
    // Resetear ventana si es necesario
    if (now - limiter.windowStart > timeWindow) {
      limiter.windowStart = now;
      limiter.requests = [now];
    }
    
    return false;
  }

  // Limpiar sesiones expiradas
  cleanupExpiredSessions() {
    const now = Date.now();
    for (const [token, session] of this.sessionTokens.entries()) {
      if (now - session.createdAt > 86400000) { // 24 horas
        this.sessionTokens.delete(token);
      }
    }
  }

  // Registrar sesión
  registerSession(token, userData, userAgent, ipAddress) {
    this.sessionTokens.set(token, {
      ...userData,
      userAgent,
      ipAddress,
      createdAt: Date.now(),
      lastAccess: Date.now()
    });
    
    // Limpiar sesiones antiguas
    if (this.sessionTokens.size > 1000) {
      this.cleanupExpiredSessions();
    }
    
    return true;
  }

  // Verificar integridad de datos
  validateDataIntegrity(data, expectedHash) {
    try {
      const calculatedHash = this.hashString(JSON.stringify(data));
      return calculatedHash === expectedHash;
    } catch (error) {
      console.error('Data integrity check failed:', error);
      return false;
    }
  }

  // Obtener headers de seguridad
  getSecurityHeaders() {
    return this.securityHeaders;
  }

  // Protección contra XSS
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  // Protección CSRF
  generateCSRFToken() {
    return this.hashString(Math.random().toString(36).substring(2, 15));
  }

  // Validar CSRF token
  validateCSRFToken(token, expectedToken) {
    return token === expectedToken;
  }

  // Verificar nivel de acceso
  hasPermission(userRole, requiredPermission) {
    const rolePermissions = {
      user: ['read'],
      premium: ['read', 'write'],
      admin: ['read', 'write', 'delete', 'admin']
    };
    
    const permissions = rolePermissions[userRole] || [];
    return permissions.includes(requiredPermission);
  }

  // Encriptar datos sensibles
  encryptData(data, key = 'default_key') {
    // Implementación básica (en producción usar crypto más robusto)
    try {
      const strData = JSON.stringify(data);
      const encrypted = btoa(strData + key);
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      return null;
    }
  }

  // Desencriptar datos sensibles
  decryptData(encryptedData, key = 'default_key') {
    try {
      const decrypted = atob(encryptedData);
      return JSON.parse(decrypted.slice(0, -key.length));
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }

  // Reporte de seguridad
  getSecurityReport() {
    return {
      activeSessions: this.sessionTokens.size,
      rateLimiters: this.ratelimiters.size,
      securityHeaders: Object.keys(this.securityHeaders).length,
      isSecure: this.isSecure
    };
  }
}

export default new SecurityManager();