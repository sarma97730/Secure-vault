const { run } = require('../config/database');

const MarksModel = {
  upsert: ({ submission_id, marks_obtained, final_marks, comments, graded_by }) =>
    run(
      `INSERT INTO marks (submission_id, marks_obtained, final_marks, comments, graded_by)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(submission_id)
       DO UPDATE SET marks_obtained=excluded.marks_obtained, final_marks=excluded.final_marks, comments=excluded.comments, graded_by=excluded.graded_by, graded_at=CURRENT_TIMESTAMP`,
      [submission_id, marks_obtained, final_marks, comments, graded_by]
    ),
};

module.exports = MarksModel;
