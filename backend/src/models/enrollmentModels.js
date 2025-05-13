const pool = require('../../db'); // Import the database connection

const Enrollment = {
    // Create a new enrollment
    create: async ({ user_id, course_id }) => {
        const query = `
            INSERT INTO enrollments (user_id, course_id, enrolled_at)
            VALUES ($1, $2, NOW())
            RETURNING *`;
        const { rows } = await pool.query(query, [user_id, course_id]);
        return rows[0];
    },

    // Find all enrollments
    findAll: async () => {
        const query = 'SELECT * FROM enrollments';
        const { rows } = await pool.query(query);
        return rows;
    },

    // Find enrollments by user ID
    findByUserId: async (user_id) => {
        const query = `
            SELECT c.id AS course_id, c.title AS course_title, c.description, c.price, e.enrolled_at
            FROM courses c
            JOIN enrollments e ON c.id = e.course_id
            WHERE e.user_id = $1`;
        const { rows } = await pool.query(query, [user_id]);
        return rows;
    },

    // Find enrollments by course ID
    findByCourseId: async (course_id) => {
        const query = `
            SELECT u.id AS user_id, u.username AS student_name, e.enrolled_at
            FROM users u
            JOIN enrollments e ON u.id = e.user_id
            WHERE e.course_id = $1`;
        const { rows } = await pool.query(query, [course_id]);
        return rows;
    },
};

module.exports = Enrollment;