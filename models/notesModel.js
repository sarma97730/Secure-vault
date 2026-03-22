const { all, run } = require('../config/database');

const NotesModel = {
  create: ({ title, subject_id, uploaded_by, file_path }) =>
    run('INSERT INTO notes (title, subject_id, uploaded_by, file_path) VALUES (?, ?, ?, ?)', [title, subject_id, uploaded_by, file_path]),
  listForTeacher: (teacherId) =>
    all(`SELECT n.*, s.name subject_name FROM notes n JOIN subjects s ON s.id=n.subject_id WHERE uploaded_by = ? ORDER BY n.id DESC`, [teacherId]),
  listAll: () =>
    all(`SELECT n.*, s.name subject_name, u.name teacher_name FROM notes n
         JOIN subjects s ON s.id = n.subject_id
         JOIN users u ON u.id = n.uploaded_by
         ORDER BY n.id DESC`),
  delete: (id, teacherId) => run('DELETE FROM notes WHERE id = ? AND uploaded_by = ?', [id, teacherId]),
  countByTeacher: (teacherId) => all('SELECT COUNT(*) count FROM notes WHERE uploaded_by = ?', [teacherId]),
};

module.exports = NotesModel;
