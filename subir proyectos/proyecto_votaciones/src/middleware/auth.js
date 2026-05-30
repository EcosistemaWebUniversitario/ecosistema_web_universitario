// src/middleware/auth.js
function loginRequired(req, res, next) {
  if (!req.session?.userId) {
    if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'No autenticado' });
    return res.redirect('/');
  }
  next();
}

function adminRequired(req, res, next) {
  if (!req.session?.userId) {
    if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'No autenticado' });
    return res.redirect('/admin-login.html');
  }
  if (req.session.userRole !== 'admin_votaciones') {
    if (req.path.startsWith('/api/')) return res.status(403).json({ error: 'No autorizado' });
    return res.redirect('/admin-login.html');
  }
  next();
}

module.exports = { loginRequired, adminRequired };
