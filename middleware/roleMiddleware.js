const allowRoles = (...roles) => (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  if (!roles.includes(req.session.user.role)) return res.status(403).render('error', { message: 'Unauthorized access.' });
  return next();
};

module.exports = { allowRoles };
