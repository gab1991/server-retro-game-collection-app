const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/AppError');
const { errorHandling } = require('./midllewares');
const { youtubeRoutes, rawgRoutes, profileRoutes, ebayRoutes, boxArtsRoutes, authRoutes } = require('./routes');

const isDevelopment = process.env.NODE_ENV === 'development';
const origin = isDevelopment ? 'http://localhost:3000' : '/';

const app = express();

// Middlewares
app.use(express.json()); // allows server to accept json
app.use(cookieParser());
isDevelopment && app.use(cors({ credentials: true, origin })); // allows cors requests with cookies

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

module.exports = app;
