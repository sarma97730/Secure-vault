const { all, get, run } = require('../config/database');

const SubjectModel = {
  list: () =>
    all(`SELECT s.*, u.name AS staff_name
         FROM subjects s
         LEFT JOIN users u ON u.id = s.staff_id
         ORDER BY s.name`),
  findById: (id) =>
    get(`SELECT s.*, u.name AS staff_name
         FROM subjects s
         LEFT JOIN users u ON u.id = s.staff_id
         WHERE s.id = ?`, [id]),
  findByStaffId: (staffId) =>
    get(`SELECT s.*, u.name AS staff_name
         FROM subjects s
         LEFT JOIN users u ON u.id = s.staff_id
         WHERE s.staff_id = ?`, [staffId]),
  create: ({ name, description, staff_id }) =>
    run('INSERT INTO subjects (name, description, staff_id) VALUES (?, ?, ?)', [name, description, staff_id || null]),
  update: ({ id, name, description, staff_id }) =>
    run('UPDATE subjects SET name = ?, description = ?, staff_id = ? WHERE id = ?', [name, description, staff_id || null, id]),
  delete: (id) => run('DELETE FROM subjects WHERE id = ?', [id]),
  count: () => get('SELECT COUNT(*) as count FROM subjects'),
};

module.exports = SubjectModel;
