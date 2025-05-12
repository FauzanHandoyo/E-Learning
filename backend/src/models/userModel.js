const pool = require('../../db'); // Import the pool from db.js

const User = {
  findAll: async () => {
    const query = 'SELECT * FROM users';
    const { rows } = await pool.query(query);
    return rows;
  },

  findById: async (id) => {
    const query = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  create: async ({ email, username, password, role }) => {
    const query = `
      INSERT INTO users (email, username, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    const { rows } = await pool.query(query, [email, username, password, role]);
    return rows[0];
  },

  update: async (id, { email, username, password, role }) => {
    const query = `
      UPDATE users
      SET email = $1, username = $2, password = $3, role = $4
      WHERE id = $5
      RETURNING *`;
    const { rows } = await pool.query(query, [email, username, password, role, id]);
    return rows[0];
  },

  delete: async (id) => {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },
};

module.exports = User;