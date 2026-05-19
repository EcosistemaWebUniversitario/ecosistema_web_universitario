// src/middleware/auth.js
// Lee el rol desde req.session.userRole que se guarda al hacer login
// El rol viene de profiles.role_id → roles.name

function loginRequired(req, res, next) {
  if (!req.session?.userId) {
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ error: 'No autenticado', redirect: '/login' });
    }
    return res.redirect('/login');
  }
  next();
}

function adminRequired(req, res, next) {
  if (!req.session?.userId) {
    if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'No autenticado' });
    return res.redirect('/login');
  }
  if (req.session.userRole !== 'admin_horarios') {
    if (req.path.startsWith('/api/')) return res.status(403).json({ error: 'No autorizado' });
    return res.redirect('/dashboard');
  }
  next();
}

module.exports = { loginRequired, adminRequired };
