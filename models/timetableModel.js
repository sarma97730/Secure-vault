const { all, get, run } = require('../config/database');

const TimetableModel = {
  create: ({ subject_id, staff_id, day, time }) =>
    run('INSERT INTO timetable (subject_id, staff_id, day, time) VALUES (?, ?, ?, ?)', [subject_id, staff_id, day, time]),
  list: () =>
    all(`SELECT t.*, s.name AS subject_name, u.name AS staff_name
         FROM timetable t
         JOIN subjects s ON s.id = t.subject_id
         JOIN users u ON u.id = t.staff_id
         ORDER BY t.day, t.time`),
  listByStaff: (staffId) =>
    all(`SELECT t.*, s.name AS subject_name
         FROM timetable t
         JOIN subjects s ON s.id = t.subject_id
         WHERE t.staff_id = ?
         ORDER BY t.day, t.time`, [staffId]),
  findDuplicateSlot: ({ staff_id, day, time }) =>
    get('SELECT * FROM timetable WHERE staff_id = ? AND day = ? AND time = ?', [staff_id, day, time]),
};

module.exports = TimetableModel;
