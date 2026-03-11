const express = require('express');
const session = require('express-session');
const path = require('path');
const { initializeDatabase } = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: 'classvault-secret-key',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  if (req.session.user.role === 'admin') return res.redirect('/admin/dashboard');
  if (req.session.user.role === 'teacher') return res.redirect('/teacher/dashboard');
  return res.redirect('/student/dashboard');
});

app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/teacher', teacherRoutes);
app.use('/student', studentRoutes);

app.use((req, res) => res.status(404).render('error', { message: 'Page not found.' }));

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`ClassVault running on http://localhost:${PORT}`);
    console.log('Default admin login: admin@classvault.com / admin123');
  });
});
