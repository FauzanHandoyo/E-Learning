const pool = require('../../db'); // Import the database connection

const Courses = {
    // Create a new course
    create: async ({ title, description, instructor_id, price }) => {
        const query = `
            INSERT INTO courses (title, description, instructor_id, price)
            VALUES ($1, $2, $3, $4)
            RETURNING *`;
        const { rows } = await pool.query(query, [title, description, instructor_id, price]);
        return rows[0];
    },

    // Get all courses
    findAll: async () => {
        const query = 'SELECT * FROM courses';
        const { rows } = await pool.query(query);
        return rows;
    },

    // Get a course by ID
    findById: async (id) => {
        const query = 'SELECT * FROM courses WHERE id = $1';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    },

    update: async (id, { title, description, price }) => {
        const query = `
            UPDATE courses
            SET title = $1, description = $2, price = $3, updated_at = NOW()
            WHERE id = $4
            RETURNING *`;
        const { rows } = await pool.query(query, [title, description, price, id]);
        return rows[0];
    },
};

module.exports = Courses;