const { all, run } = require('../config/database');

const SubmissionModel = {
  createOrUpdate: ({ assignment_id, student_id, file_path, is_late }) =>
    run(
      `INSERT INTO submissions (assignment_id, student_id, file_path, is_late)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(assignment_id, student_id)
       DO UPDATE SET file_path=excluded.file_path, submitted_at=CURRENT_TIMESTAMP, is_late=excluded.is_late`,
      [assignment_id, student_id, file_path, is_late]
    ),
  listForTeacher: (teacherId) =>
    all(`SELECT sub.*, u.name student_name, a.title assignment_title, a.deadline, a.max_marks, a.late_penalty,
            m.marks_obtained, m.final_marks
         FROM submissions sub
         JOIN assignments a ON a.id = sub.assignment_id
         JOIN users u ON u.id = sub.student_id
         LEFT JOIN marks m ON m.submission_id = sub.id
         WHERE a.created_by = ?
         ORDER BY sub.submitted_at DESC`, [teacherId]),
  listByStudent: (studentId) =>
    all(`SELECT sub.*, a.title assignment_title, m.marks_obtained, m.final_marks
         FROM submissions sub
         JOIN assignments a ON a.id = sub.assignment_id
         LEFT JOIN marks m ON m.submission_id=sub.id
         WHERE sub.student_id = ?`, [studentId]),
};

module.exports = SubmissionModel;
