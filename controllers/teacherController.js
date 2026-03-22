const NotesModel = require('../models/notesModel');
const AssignmentModel = require('../models/assignmentModel');
const SubjectModel = require('../models/subjectModel');
const SubmissionModel = require('../models/submissionModel');
const AttendanceModel = require('../models/attendanceModel');
const MarksModel = require('../models/marksModel');
const TimetableModel = require('../models/timetableModel');
const { all, get } = require('../config/database');

const dashboard = async (req, res) => {
  const assignedSubject = await SubjectModel.findByStaffId(req.session.user.id);
  const subjectId = assignedSubject ? assignedSubject.id : null;
  const notesCount = subjectId ? await get('SELECT COUNT(*) AS count FROM notes WHERE uploaded_by = ? AND subject_id = ?', [req.session.user.id, subjectId]) : { count: 0 };
  const assignmentCount = subjectId ? await get('SELECT COUNT(*) AS count FROM assignments WHERE created_by = ? AND subject_id = ?', [req.session.user.id, subjectId]) : { count: 0 };
  const attendanceCount = subjectId ? await get('SELECT COUNT(*) AS count FROM attendance WHERE marked_by = ? AND subject_id = ?', [req.session.user.id, subjectId]) : { count: 0 };

  res.render('teacherDashboard', {
    user: req.session.user,
    stats: {
      notes: notesCount.count || 0,
      assignments: assignmentCount.count || 0,
      attendance: attendanceCount.count || 0,
    },
    assignedSubject,
    timetableEntries: await TimetableModel.listByStaff(req.session.user.id),
    notes: subjectId
      ? await all(`SELECT n.*, s.name subject_name FROM notes n JOIN subjects s ON s.id = n.subject_id WHERE n.uploaded_by = ? AND n.subject_id = ? ORDER BY n.id DESC`, [req.session.user.id, subjectId])
      : [],
    assignments: subjectId
      ? await all(`SELECT a.*, s.name subject_name FROM assignments a JOIN subjects s ON s.id = a.subject_id WHERE a.created_by = ? AND a.subject_id = ? ORDER BY a.id DESC`, [req.session.user.id, subjectId])
      : [],
    submissions: subjectId
      ? await all(`SELECT sub.*, u.name student_name, a.title assignment_title, a.deadline, a.max_marks, a.late_penalty,
              m.marks_obtained, m.final_marks
           FROM submissions sub
           JOIN assignments a ON a.id = sub.assignment_id
           JOIN users u ON u.id = sub.student_id
           LEFT JOIN marks m ON m.submission_id = sub.id
           WHERE a.created_by = ? AND a.subject_id = ?
           ORDER BY sub.submitted_at DESC`, [req.session.user.id, subjectId])
      : [],
    students: await all("SELECT id, name FROM users WHERE role='student' ORDER BY name"),
  });
};

const uploadNote = async (req, res) => {
  const assignedSubject = await SubjectModel.findByStaffId(req.session.user.id);
  if (!assignedSubject) return res.redirect('/teacher/dashboard');

  await NotesModel.create({
    title: req.body.title,
    subject_id: assignedSubject.id,
    uploaded_by: req.session.user.id,
    file_path: `/uploads/notes/${req.file.filename}`,
  });
  res.redirect('/teacher/dashboard');
};

const deleteNote = async (req, res) => {
  await NotesModel.delete(req.params.id, req.session.user.id);
  res.redirect('/teacher/dashboard');
};

const createAssignment = async (req, res) => {
  const assignedSubject = await SubjectModel.findByStaffId(req.session.user.id);
  if (!assignedSubject) return res.redirect('/teacher/dashboard');

  await AssignmentModel.create({
    ...req.body,
    subject_id: assignedSubject.id,
    created_by: req.session.user.id,
    file_path: req.file ? `/uploads/assignments/${req.file.filename}` : null,
  });
  res.redirect('/teacher/dashboard');
};

const markAttendance = async (req, res) => {
  const assignedSubject = await SubjectModel.findByStaffId(req.session.user.id);
  if (!assignedSubject) return res.redirect('/teacher/dashboard');

  await AttendanceModel.mark({
    ...req.body,
    subject_id: assignedSubject.id,
    marked_by: req.session.user.id,
  });
  res.redirect('/teacher/dashboard');
};

const enterMarks = async (req, res) => {
  const { submission_id, marks_obtained, comments } = req.body;
  const sub = await get(
    `SELECT s.id, s.is_late, a.late_penalty, a.max_marks
     FROM submissions s JOIN assignments a ON a.id=s.assignment_id WHERE s.id = ?`,
    [submission_id]
  );
  const raw = Number(marks_obtained);
  const penalty = sub.is_late ? Number(sub.late_penalty) : 0;
  const finalMarks = Math.max(0, Math.min(Number(sub.max_marks), raw - penalty));
  await MarksModel.upsert({
    submission_id,
    marks_obtained: raw,
    final_marks: finalMarks,
    comments,
    graded_by: req.session.user.id,
  });
  res.redirect('/teacher/dashboard');
};

module.exports = { dashboard, uploadNote, deleteNote, createAssignment, markAttendance, enterMarks };
