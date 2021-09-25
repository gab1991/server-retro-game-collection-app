const express = require('express');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitizer = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const AppError = require('./utils/AppError');
const { errorHandling } = require('./midllewares');
const { youtubeRoutes, rawgRoutes, profileRoutes, ebayRoutes, boxArtsRoutes, authRoutes } = require('./routes');

const fs = require('fs');

const isDevelopment = process.env.NODE_ENV === 'development';
const origin = isDevelopment ? 'http://localhost:3000' : '/';

export const app = express();

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Your limit is out. Try again in 15 minutes',
});

/** Middlewares */
// Security
app.use('/api/', apiLimiter);
app.use(helmet());
app.use(mongoSanitizer()); // noSQL injection protection
app.use(xssClean()); // xss injection protection
app.use(hpp()); // prevents http parameter pollution

// General
app.use(express.json()); // allows server to accept json
app.use(cookieParser());
isDevelopment && app.use(cors({ credentials: true, origin })); // allows cors requests with cookies
app.use(compression()); // compresses responses

// Router
app.use('/api/auth', authRoutes);
app.use('/api/box_arts', boxArtsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/ebay', ebayRoutes);
app.use('/api/rawg', rawgRoutes);

// Static
app.use(express.static('build'));
app.use(express.static('assets_minified_for_prod'));

// Basic html sending
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

// 404 handling
app.all('*', (req, res, next) => next(new AppError('required resource is not found', 404)));

// Error handling
app.use(errorHandling);
