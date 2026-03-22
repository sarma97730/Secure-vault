const express = require('express');
const { loginPage, login, logout } = require('../controllers/authController');

const router = express.Router();
router.get('/login', loginPage);
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;
