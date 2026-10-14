// Configuración de seguridad del juego
export const SecurityConfig = {
  // Parámetros de sesión
  session: {
    timeout: 86400000,           // 24 horas en ms
    autoRenew: true,             // Renovación automática
    renewThreshold: 3600000,     // 1 hora antes de expirar para renovar
    secureCookies: true,         // Cookies seguras (solo HTTPS)
    httpOnly: true,              // Cookies HTTP only
    sameSite: 'strict'           // SameSite strict para evitar CSRF
  },

  // Protección contra rate limiting
  rateLimiting: {
    maxRequests: 100,            // Máximo de solicitudes por ventana
    timeWindow: 3600000,         // Ventana de tiempo en ms (1 hora)
    bruteForceAttempts: 5,       // Intentos antes de bloqueo forzoso
    bruteForceWindow: 300000     // Ventana para fuerza bruta (5 minutos)
  },

  // Protección XSS
  xssProtection: {
    enabled: true,
    sanitizeInputs: true,
    blacklistPatterns: [
      /<script[^>]*>.*?<\/script>/gi,
      /on\w+\s*=\s*["'][^"']*["']/gi,
      /javascript:/gi,
      /vbscript:/gi
    ],
    whitelistTags: ['b', 'i', 'u', 'em', 'strong']
  },

  // Headers de seguridad HTTP
  securityHeaders: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  },

  // Validaciones de entrada
  inputValidation: {
    maxStringLength: 1000,
    allowedSpecialChars: [' ', '-', '.', ',', '!', '?', '(', ')'],
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    usernameRegex: /^[a-zA-Z0-9_]{3,20}$/,
    passwordRequirements: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true,
      requireSpecialChar: true
    }
  },

  // Encriptación
  encryption: {
    enabled: true,
    algorithm: 'AES-256-GCM',
    keyLength: 256,
    ivLength: 12
  },

  // Auditoría de seguridad
  audit: {
    enabled: true,
    logSecurityEvents: true,
    maxLogEntries: 10000,
    logLevel: 'info'
  },

  // Rutas protegidas
  protectedRoutes: {
    '/api/admin': ['admin'],
    '/api/user/settings': ['user', 'premium', 'admin'],
    '/api/character/create': ['user', 'premium', 'admin'],
    '/api/bank/transfer': ['user', 'premium', 'admin']
  },

  // Niveles de permiso
  permissions: {
    user: ['read'],
    premium: ['read', 'write'],
    admin: ['read', 'write', 'delete', 'admin']
  }
};

// Funciones para obtener configuraciones específicas
export const getSessionConfig = () => SecurityConfig.session;
export const getRateLimitConfig = () => SecurityConfig.rateLimiting;
export const getXSSConfig = () => SecurityConfig.xssProtection;
export const getSecurityHeaders = () => SecurityConfig.securityHeaders;
export const getInputValidationConfig = () => SecurityConfig.inputValidation;
export const getEncryptionConfig = () => SecurityConfig.encryption;
export const getAuditConfig = () => SecurityConfig.audit;

// Validar permisos
export const isPermissionValid = (permission) => {
  return Object.keys(SecurityConfig.permissions).includes(permission);
};

// Validar ruta protegida
export const isRouteProtected = (route) => {
  return Object.keys(SecurityConfig.protectedRoutes).some(
    protectedRoute => route.startsWith(protectedRoute)
  );
};