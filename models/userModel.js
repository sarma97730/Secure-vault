const { all, get, run } = require('../config/database');

const UserModel = {
  findByEmail: (email) => get('SELECT * FROM users WHERE email = ?', [email]),
  findById: (id) => get('SELECT id, name, email, role FROM users WHERE id = ?', [id]),
  list: () => all('SELECT id, name, email, role, created_at FROM users ORDER BY id DESC'),
  create: ({ name, email, password, role }) =>
    run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, password, role]),
  update: ({ id, name, email, role }) =>
    run('UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?', [name, email, role, id]),
  delete: (id) => run("DELETE FROM users WHERE id = ? AND role != 'admin'", [id]),
  counts: async () => {
    const rows = await all("SELECT role, COUNT(*) as count FROM users GROUP BY role");
    return rows.reduce((acc, row) => ({ ...acc, [row.role]: row.count }), {});
  },
};

module.exports = UserModel;
