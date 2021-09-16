const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/AppError');
const { errorHandling } = require('./midllewares');

const isDevelopment = process.env.NODE_ENV === 'development';
const origin = isDevelopment ? 'http://localhost:3000' : '/';

const app = express();

// Middlewares
app.use(express.json()); // allows server to accept json
app.use(cookieParser());
isDevelopment && app.use(cors({ credentials: true, origin })); // allows cors requests with cookies

// Router
const authRouter = require('./routes/auth.js');
const boxArtRouter = require('./routes/boxArts.js');
const profileRouter = require('./routes/profile.js');
const youtubeRouter = require('./routes/youtube.js');
const ebayRouter = require('./routes/ebay.js');
const RAWGRouter = require('./routes/rawg.js');

app.use('/api/auth', authRouter);
app.use('/api/box_arts', boxArtRouter);
app.use('/api/profile', profileRouter);
app.use('/api/youtube', youtubeRouter);
app.use('/api/ebay', ebayRouter);
app.use('/api/rawg', RAWGRouter);

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
