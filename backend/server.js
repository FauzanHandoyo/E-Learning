const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const pool = require('./db'); // Import the centralized db.js file
const userRoutes = require('./src/routes/userRoutes'); // Import user routes
const authRoutes = require('./src/routes/authRoutes'); // Import auth routes
const instructorRoutes = require('./src/routes/instructorRoutes'); // Import instructor routes
const courseRoutes = require('./src/routes/coursesRoutes'); // Import course routes
const enrollmentRoutes = require('./src/routes/enrollmentRoutes'); // Import enrollment routes
const courseContentRoutes = require('./src/routes/courseContentRoutes'); // Import course content routes
const categoryRoutes = require('./src/routes/categoryRoutes'); // Import category routes

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({limit: '50mb'})); // Increase the limit for JSON payloads
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable CORS
app.use(cors({
  origin: '*', // In production, specify your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Test route
app.get('/', (req, res) => {
  res.send('🎉 Online E-Learning Backend is running!');
});

// Auth routes
app.use('/api/auth', authRoutes); // Mount auth routes

// User routes
app.use('/api/users', userRoutes); // Mount user routes
app.use('/api/instructors', instructorRoutes); // Mount instructor routes
app.use('/api/courses', courseRoutes); // Mount course routes
app.use('/api/enrollments', enrollmentRoutes); // Mount enrollment routes
app.use('/api/course-contents', courseContentRoutes); // Mount course content routes
app.use('/api/categories', categoryRoutes); // Mount category routes

// Test database connection
pool.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch((err) => console.error('Failed to connect to PostgreSQL:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});