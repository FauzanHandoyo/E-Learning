const pool = require('../../db');

// Function to handle instructor application
const applyToBeInstructor = async (req, res) => {
    try {
        const userId = req.user.id;
        const { termsAccepted } = req.body;
        
        // Validate terms acceptance
        if (!termsAccepted) {
            return res.status(400).json({ 
                message: 'You must accept the terms to become an instructor' 
            });
        }

        // Check if user exists and is a student
        const userQuery = `SELECT id, username, email, role FROM users WHERE id = $1`;
        const userResult = await pool.query(userQuery, [userId]);
        
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (userResult.rows[0].role === 'instructor') {
            return res.status(400).json({ message: 'You are already an instructor' });
        }
        
        if (userResult.rows[0].role !== 'student') {
            return res.status(400).json({ message: 'Only students can apply to become instructors' });
        }

        // Update user role to instructor
        const updateQuery = `
            UPDATE users 
            SET role = 'instructor' 
            WHERE id = $1 
            RETURNING id, username, email, role`;
        const result = await pool.query(updateQuery, [userId]);
        
        res.status(200).json({
            message: 'Congratulations! You are now an instructor.',
            user: result.rows[0]
        });
        
    } catch (error) {
        console.error('Error upgrading to instructor:', error);
        res.status(500).json({ 
            message: 'Failed to process instructor application', 
            error: error.message 
        });
    }
};

module.exports = {
    applyToBeInstructor
};