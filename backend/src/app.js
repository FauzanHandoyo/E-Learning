// src/app.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import routes from './routes/index.routes.js';

// Validasi environment variables sebelum startup
const requiredEnvVars = ['CLIENT_URL', 'DATABASE_URL', 'JWT_SECRET'];
requiredEnvVars.forEach(env => {
  if (!process.env[env]) {
    throw new Error(` Environment variable ${env} is required`);
  }
});

// Inisialisasi Express
const app = express();

// MIDDLEWARE CONFIGURATION

// 1. Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://*.example.com"]
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 1000, // Limit 1000 request per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: '⚠️ Terlalu banyak permintaan dari IP ini, coba lagi nanti'
});
app.use(limiter);

// 3. CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL.split(','),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  credentials: true,
  maxAge: 600
}));

// 4. Body Parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 5. Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ======================
// ROUTES CONFIGURATION
// ======================

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
});

// Main API Routes
app.use('/api/v1', routes);

// ======================
// ERROR HANDLING
// ======================

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `🔍 Route ${req.originalUrl} tidak ditemukan`
  });
});

// Error Controller
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'Terjadi kesalahan pada server';

  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error Stack:', err.stack);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;