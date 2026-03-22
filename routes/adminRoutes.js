const express = require('express');
const {
  dashboard,
  createUser,
  updateUser,
  deleteUser,
  createSubject,
  updateSubject,
  createTimetableEntry,
} = require('../controllers/adminController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(ensureAuthenticated, allowRoles('admin'));
router.get('/dashboard', dashboard);
router.post('/users/create', createUser);
router.post('/users/update', updateUser);
router.post('/users/delete/:id', deleteUser);
router.post('/subjects/create', createSubject);
router.post('/subjects/update', updateSubject);
router.post('/timetable/create', createTimetableEntry);

module.exports = router;
