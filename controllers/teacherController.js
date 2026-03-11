const NotesModel = require('../models/notesModel');
const AssignmentModel = require('../models/assignmentModel');
const SubjectModel = require('../models/subjectModel');
const SubmissionModel = require('../models/submissionModel');
const AttendanceModel = require('../models/attendanceModel');
const MarksModel = require('../models/marksModel');
const { all, get } = require('../config/database');

const dashboard = async (req, res) => {
  const notesCount = await NotesModel.countByTeacher(req.session.user.id);
  const assignmentCount = await AssignmentModel.countByTeacher(req.session.user.id);
  const attendanceCount = await AttendanceModel.countByTeacher(req.session.user.id);
  res.render('teacherDashboard', {
    user: req.session.user,
    stats: {
      notes: notesCount[0]?.count || 0,
      assignments: assignmentCount.count || 0,
      attendance: attendanceCount.count || 0,
    },
    subjects: await SubjectModel.list(),
    notes: await NotesModel.listForTeacher(req.session.user.id),
    assignments: await AssignmentModel.listByTeacher(req.session.user.id),
    submissions: await SubmissionModel.listForTeacher(req.session.user.id),
    students: await all("SELECT id, name FROM users WHERE role='student' ORDER BY name"),
  });
};

const uploadNote = async (req, res) => {
  await NotesModel.create({
    title: req.body.title,
    subject_id: req.body.subject_id,
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
  await AssignmentModel.create({
    ...req.body,
    created_by: req.session.user.id,
    file_path: req.file ? `/uploads/assignments/${req.file.filename}` : null,
  });
  res.redirect('/teacher/dashboard');
};

const markAttendance = async (req, res) => {
  await AttendanceModel.mark({ ...req.body, marked_by: req.session.user.id });
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
