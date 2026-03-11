const { all, get, run } = require('../config/database');

const SubjectModel = {
  list: () => all('SELECT * FROM subjects ORDER BY name'),
  findById: (id) => get('SELECT * FROM subjects WHERE id = ?', [id]),
  create: ({ name, description }) =>
    run('INSERT INTO subjects (name, description) VALUES (?, ?)', [name, description]),
  update: ({ id, name, description }) =>
    run('UPDATE subjects SET name = ?, description = ? WHERE id = ?', [name, description, id]),
  delete: (id) => run('DELETE FROM subjects WHERE id = ?', [id]),
  count: () => get('SELECT COUNT(*) as count FROM subjects'),
};

module.exports = SubjectModel;
