const SubjectModel = require('../models/subjectModel');
const NotesModel = require('../models/notesModel');
const AssignmentModel = require('../models/assignmentModel');
const SubmissionModel = require('../models/submissionModel');
const AttendanceModel = require('../models/attendanceModel');

const dashboard = async (req, res) => {
  const assignments = await AssignmentModel.listAll();
  const submissions = await SubmissionModel.listByStudent(req.session.user.id);
  const submittedMap = new Map(submissions.map((s) => [s.assignment_id, s]));

  const pendingAssignments = assignments.filter((a) => !submittedMap.has(a.id)).length;

  res.render('studentDashboard', {
    user: req.session.user,
    stats: {
      subjects: (await SubjectModel.list()).length,
      pendingAssignments,
      marksReceived: submissions.filter((s) => s.final_marks !== null && s.final_marks !== undefined).length,
      attendancePercent: (await AttendanceModel.attendancePercent(req.session.user.id)).percentage || 0,
    },
    notes: await NotesModel.listAll(),
    assignments,
    submissions,
    attendance: await AttendanceModel.listByStudent(req.session.user.id),
  });
};

const submitAssignment = async (req, res) => {
  const assignment = (await AssignmentModel.listAll()).find((a) => a.id === Number(req.body.assignment_id));
  const isLate = new Date() > new Date(assignment.deadline) ? 1 : 0;
  await SubmissionModel.createOrUpdate({
    assignment_id: req.body.assignment_id,
    student_id: req.session.user.id,
    file_path: `/uploads/submissions/${req.file.filename}`,
    is_late: isLate,
  });
  res.redirect('/student/dashboard');
};

module.exports = { dashboard, submitAssignment };
