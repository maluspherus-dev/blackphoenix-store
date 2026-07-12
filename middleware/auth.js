const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

const verificarAdmin = (req, res, next) => {
  verificarToken(req, res, () => {
    if (!req.usuario.eh_admin) {
      return res.status(403).json({ error: 'Acesso negado. Admin requerido.' });
    }
    next();
  });
};

module.exports = { verificarToken, verificarAdmin };
