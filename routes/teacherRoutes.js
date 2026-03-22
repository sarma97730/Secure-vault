const express = require('express');
const multer = require('multer');
const path = require('path');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');
const {
  dashboard,
  uploadNote,
  deleteNote,
  createAssignment,
  markAttendance,
  enterMarks,
} = require('../controllers/teacherController');

const makeStorage = (folder) =>
  multer.diskStorage({
    destination: path.join(__dirname, '..', 'public', 'uploads', folder),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`),
  });

const uploadNoteFile = multer({ storage: makeStorage('notes') });
const uploadAssignmentFile = multer({ storage: makeStorage('assignments') });

const router = express.Router();
router.use(ensureAuthenticated, allowRoles('teacher'));
router.get('/dashboard', dashboard);
router.post('/notes/upload', uploadNoteFile.single('note_file'), uploadNote);
router.post('/notes/delete/:id', deleteNote);
router.post('/assignments/create', uploadAssignmentFile.single('assignment_file'), createAssignment);
router.post('/attendance/mark', markAttendance);
router.post('/marks/enter', enterMarks);

module.exports = router;
