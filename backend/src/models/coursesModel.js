const pool = require('../../db'); // Import the database connection

const Courses = {
    // Create a new course
    create: async ({ title, description, instructor_id, price, category_id }) => {
        const query = `
            INSERT INTO courses (title, description, instructor_id, price, category_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`;
        const { rows } = await pool.query(query, [title, description, instructor_id, price, category_id]);
        return rows[0];
    },

    // Get all courses
    findAll: async () => {
        const query = `
            SELECT c.*, u.username as instructor_name, cat.name as category_name
            FROM courses c
            JOIN users u ON c.instructor_id = u.id
            LEFT JOIN categories cat ON c.category_id = cat.id`;
        const { rows } = await pool.query(query);
        return rows;
    },

    // Get a course by ID
    findById: async (id) => {
        const query = `
            SELECT c.*, u.username as instructor_name, cat.name as category_name
            FROM courses c
            JOIN users u ON c.instructor_id = u.id
            LEFT JOIN categories cat ON c.category_id = cat.id
            WHERE c.id = $1`;
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

    getEnrolledCourses: async (userId) => {
        try {
            const query = `
                SELECT c.*
                FROM courses c
                JOIN enrollments e ON c.id = e.course_id
                WHERE e.user_id = $1
            `;
            const { rows } = await pool.query(query, [userId]); // Fetch courses from the database
            return rows;
        } catch (error) {
            console.error('Error in getEnrolledCourses:', error); // Log the error
            throw error;
        }
    },
    
};

module.exports = Courses;