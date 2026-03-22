const { all, get, run } = require('../config/database');

const AssignmentModel = {
  create: (data) =>
    run(
      `INSERT INTO assignments (title, description, subject_id, created_by, file_path, deadline, max_marks, late_penalty)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [data.title, data.description, data.subject_id, data.created_by, data.file_path, data.deadline, data.max_marks, data.late_penalty]
    ),
  listByTeacher: (teacherId) =>
    all(`SELECT a.*, s.name subject_name FROM assignments a JOIN subjects s ON s.id=a.subject_id WHERE created_by=? ORDER BY a.id DESC`, [teacherId]),
  listAll: () =>
    all(`SELECT a.*, s.name subject_name, u.name teacher_name FROM assignments a
      JOIN subjects s ON s.id = a.subject_id
      JOIN users u ON u.id = a.created_by
      ORDER BY a.deadline ASC`),
  findById: (id) => get('SELECT * FROM assignments WHERE id = ?', [id]),
  count: () => get('SELECT COUNT(*) as count FROM assignments'),
  countByTeacher: (teacherId) => get('SELECT COUNT(*) as count FROM assignments WHERE created_by = ?', [teacherId]),
};

module.exports = AssignmentModel;
