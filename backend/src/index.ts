import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import challengeRoutes from './routes/challenges';
import sessionRoutes from './routes/sessions';
import verifyRoutes from './routes/verify';
import credentialRoutes from './routes/credentials';

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studychain';

// Middlewares
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB database successfully');
  })
  .catch((err) => {
    console.error('MongoDB database connection error:', err);
  });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/credentials', credentialRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`StudyChain backend running on port ${PORT}`);
});
