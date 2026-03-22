const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');

const loginPage = (req, res) => res.render('login', { error: null });

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findByEmail(email);
  if (!user) return res.render('login', { error: 'Invalid credentials.' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.render('login', { error: 'Invalid credentials.' });

  req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };

  if (user.role === 'admin') return res.redirect('/admin/dashboard');
  if (user.role === 'teacher') return res.redirect('/teacher/dashboard');
  return res.redirect('/student/dashboard');
};

const logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};

module.exports = { loginPage, login, logout };
