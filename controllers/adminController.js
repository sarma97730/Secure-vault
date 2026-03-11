const bcrypt = require('bcryptjs');
const { all, run } = require('../config/database');
const UserModel = require('../models/userModel');
const SubjectModel = require('../models/subjectModel');
const AssignmentModel = require('../models/assignmentModel');

const dashboard = async (req, res) => {
  const userCounts = await UserModel.counts();
  const subjectCount = await SubjectModel.count();
  const assignmentCount = await AssignmentModel.count();
  const activities = await all('SELECT * FROM activity_logs ORDER BY id DESC LIMIT 10');

  res.render('adminDashboard', {
    user: req.session.user,
    stats: {
      totalUsers: (userCounts.admin || 0) + (userCounts.teacher || 0) + (userCounts.student || 0),
      totalTeachers: userCounts.teacher || 0,
      totalStudents: userCounts.student || 0,
      totalSubjects: subjectCount.count,
      totalAssignments: assignmentCount.count,
    },
    users: await UserModel.list(),
    subjects: await SubjectModel.list(),
    activities,
  });
};

const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await UserModel.create({ name, email, password: hash, role });
  await run('INSERT INTO activity_logs (user_id, action) VALUES (?, ?)', [req.session.user.id, `Created user ${email} as ${role}`]);
  res.redirect('/admin/dashboard');
};

const updateUser = async (req, res) => {
  const { id, name, email, role } = req.body;
  await UserModel.update({ id, name, email, role });
  await run('INSERT INTO activity_logs (user_id, action) VALUES (?, ?)', [req.session.user.id, `Updated user ${email}`]);
  res.redirect('/admin/dashboard');
};

const deleteUser = async (req, res) => {
  await UserModel.delete(req.params.id);
  await run('INSERT INTO activity_logs (user_id, action) VALUES (?, ?)', [req.session.user.id, `Deleted user ID ${req.params.id}`]);
  res.redirect('/admin/dashboard');
};

const createSubject = async (req, res) => {
  await SubjectModel.create(req.body);
  await run('INSERT INTO activity_logs (user_id, action) VALUES (?, ?)', [req.session.user.id, `Created subject ${req.body.name}`]);
  res.redirect('/admin/dashboard');
};

module.exports = { dashboard, createUser, updateUser, deleteUser, createSubject };
