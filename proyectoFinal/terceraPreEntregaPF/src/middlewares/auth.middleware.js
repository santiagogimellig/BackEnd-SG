// Middleware para administradores: verifica si el usuario está autenticado y tiene el rol de 'admin'
export const adminMiddleware = (req, res, next) => {
  // Verifico si el usuario está autenticado y tiene el rol de 'admin'
  if (req.isAuthenticated() && req.user.role === 'admin') {
    // Si cumple con las condiciones, paso al siguiente middleware o ruta
    return next();
  } else {
    // Si no cumple con las condiciones, envío un código de estado 403 (Prohibido)
    res.sendStatus(403);
  }
};

// Middleware para usuarios comunes: verifica si el usuario está autenticado y tiene el rol de 'user'
export const userMiddleware = (req, res, next) => {
  // Verifico si el usuario está autenticado y tiene el rol de 'user'
  if (req.isAuthenticated() && req.user.role === 'user') {
    // Si cumple con las condiciones, paso al siguiente middleware o ruta
    return next();
  } else {
    // Si no cumple con las condiciones, envío un código de estado 403 (Prohibido)
    res.sendStatus(403);
  }
};