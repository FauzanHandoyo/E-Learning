const pool = require('../../db'); // Import the database connection

const Instructor = {
    // Create a new instructor application
    createApplication: async (userId) => {
        const query = `
            INSERT INTO instructor_applications (user_id)
            VALUES ($1)
            RETURNING *`;
        const { rows } = await pool.query(query, [userId]);
        return rows[0];
    },

    // Update user role to instructor
    updateUserRole: async (userId) => {
        const query = 'UPDATE users SET role = $1 WHERE id = $2';
        await pool.query(query, ['instructor', userId]);
    },

    // Check if the user is already an instructor
    checkUserRole: async (userId) => {
        const query = 'SELECT role FROM users WHERE id = $1';
        const { rows } = await pool.query(query, [userId]);
        return rows[0];
    },
};

module.exports = Instructor;