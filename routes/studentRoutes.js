const express = require('express');
const multer = require('multer');
const path = require('path');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');
const { dashboard, submitAssignment } = require('../controllers/studentController');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'public', 'uploads', 'submissions'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`),
});
const upload = multer({ storage });

const router = express.Router();
router.use(ensureAuthenticated, allowRoles('student'));
router.get('/dashboard', dashboard);
router.post('/assignments/submit', upload.single('submission_file'), submitAssignment);

module.exports = router;
