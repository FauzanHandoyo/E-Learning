const pool = require('../../db'); // Import the pool from db.js
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

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

  findByEmail: async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  },

  create: async ({ email, username, password, role }) => {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `
      INSERT INTO users (email, username, password, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *`;
    const { rows } = await pool.query(query, [email, username, hashedPassword, role]);
    return rows[0];
  },

  update: async (id, fields) => {
    // Check if the password is being updated
    if (fields.password) {
      const salt = await bcrypt.genSalt(10);
      fields.password = await bcrypt.hash(fields.password, salt);
    }

    const setClause = Object.keys(fields)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');

    const values = Object.values(fields);
    values.push(id); // Add the `id` as the last parameter

    const query = `
      UPDATE users
      SET ${setClause}, updated_at = NOW()
      WHERE id = $${values.length}
      RETURNING *`;
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  delete: async (id) => {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  getCoursesHeld: async (instructorId) => {
    const query = `
      SELECT 
        c.id AS course_id, 
        c.title AS course_title, 
        c.description, 
        c.price, 
        c.created_at, 
        u.username AS instructor_name
      FROM courses c
      JOIN users u ON c.instructor_id = u.id
      WHERE c.instructor_id = $1`;
    const { rows } = await pool.query(query, [instructorId]);
    return rows;
  },

  // New method to fetch enrolled courses for a user
  getEnrolledCourses: async (userId) => {
    const query = `
      SELECT 
        c.id AS course_id, 
        c.title AS course_title, 
        c.description, 
        c.price, 
        c.created_at
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = $1`;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  },
};

module.exports = User;