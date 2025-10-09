// server.js - Fixed version
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import portfolioRoutes from "./routes/portfolio.routes.js";
import labourRoutes from "./routes/labour.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import payrollRoutes from "./routes/payroll.routes.js";
import siteRoutes from "./routes/site.routes.js";
import authRoutes from "./routes/auth.routes.js";      
import authenticateToken from "./middlewares/auth.middleware.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Trust proxy for Render deployment
app.set('trust proxy', 1);

// Enhanced CORS configuration for production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://sonaiengineering.com',
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
];

// Filter out undefined values
const validOrigins = allowedOrigins.filter(origin => origin && origin !== 'undefined');

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (validOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // In production, be more strict
    if (process.env.NODE_ENV === 'production') {
      return callback(new Error('Not allowed by CORS'), false);
    }
    
    // In development, allow all origins
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/labour", authenticateToken, labourRoutes);
app.use("/api/attendance", authenticateToken, attendanceRoutes);
app.use("/api/payroll", authenticateToken, payrollRoutes);
app.use("/api/sites", authenticateToken, siteRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "MEP Labour Management API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      portfolio: "/api/portfolio",
      labour: "/api/labour",
      attendance: "/api/attendance",
      payroll: "/api/payroll",
      sites: "/api/sites"
    }
  });
});

// 404 handler - FIXED: Use a function instead of '*'
app.use((req, res, next) => {
  if (!res.headersSent) {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
      availableEndpoints: ['/api/auth', '/api/portfolio', '/api/labour', '/api/attendance', '/api/payroll', '/api/sites']
    });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (!res.headersSent) {
    res.status(err.status || 500).json({
      success: false,
      message: isDevelopment ? err.message : 'Internal server error',
      ...(isDevelopment && { stack: err.stack }),
      timestamp: new Date().toISOString()
    });
  }
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Server startup
const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  if (process.env.NODE_ENV === 'production') {
    console.log('🔒 Running in production mode');
  }
});
