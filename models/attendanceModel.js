const { all, get, run } = require('../config/database');

const AttendanceModel = {
  mark: ({ student_id, subject_id, date, status, marked_by }) =>
    run('INSERT INTO attendance (student_id, subject_id, date, status, marked_by) VALUES (?, ?, ?, ?, ?)', [student_id, subject_id, date, status, marked_by]),
  listByStudent: (studentId) =>
    all(`SELECT a.*, s.name subject_name FROM attendance a
         JOIN subjects s ON s.id = a.subject_id
         WHERE student_id = ? ORDER BY date DESC`, [studentId]),
  countByTeacher: (teacherId) =>
    get('SELECT COUNT(*) as count FROM attendance WHERE marked_by = ?', [teacherId]),
  attendancePercent: (studentId) =>
    get(`SELECT ROUND(100.0 * SUM(CASE WHEN status='Present' THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0), 2) as percentage
         FROM attendance WHERE student_id = ?`, [studentId]),
};

module.exports = AttendanceModel;
