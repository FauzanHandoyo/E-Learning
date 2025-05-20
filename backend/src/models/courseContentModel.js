const pool = require('../../db');

const CourseContent = {
  // Create new course content
  create: async ({ course_id, title, content_url }) => {
    const query = `
      INSERT INTO course_content (course_id, title, content_url, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *`;
    const { rows } = await pool.query(query, [course_id, title, content_url]);
    return rows[0];
  },

  // Get all content for a specific course
  findByCourseId: async (course_id) => {
    const query = `
      SELECT * FROM course_content 
      WHERE course_id = $1
      ORDER BY created_at DESC`;
    const { rows } = await pool.query(query, [course_id]);
    return rows;
  },

  // Find content by ID
  findById: async (id) => {
    const query = `SELECT * FROM course_content WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Delete content
  delete: async (id) => {
    const query = `DELETE FROM course_content WHERE id = $1`;
    await pool.query(query, [id]);
  }
};

module.exports = CourseContent;