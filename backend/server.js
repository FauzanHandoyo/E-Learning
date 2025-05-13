const express = require('express');
const dotenv = require('dotenv');
const pool = require('./db'); // Import the centralized db.js file
const userRoutes = require('./src/routes/userRoutes'); // Import user routes
const instructorRoutes = require('./src/routes/instructorRoutes'); // Import instructor routes
const courseRoutes = require('./src/routes/coursesRoutes'); // Import course routes
const enrollmentRoutes = require('./src/routes/enrollmentRoutes'); // Import enrollment routes
const courseContentRoutes = require('./src/routes/courseContentRoutes'); // Import course content routes
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('🎉 Online E-Learning Backend is running!');
});

// User routes
app.use('/api/users', userRoutes); // Mount user routes
app.use('/api/instructors', instructorRoutes); // Mount instructor routes
app.use('/api/courses', courseRoutes); // Mount course routes
app.use('/api/enrollments', enrollmentRoutes); // Mount enrollment routes
app.use('/api/course-contents', courseContentRoutes); // Mount course content routes
// Test database connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch((err) => console.error('Failed to connect to PostgreSQL:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});