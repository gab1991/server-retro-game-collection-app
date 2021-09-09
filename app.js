const express = require('express');
const cors = require('cors');
const path = require('path');
const { errorHandling } = require('./midllewares/errorHandling');

const app = express();

// allows server accepts jason
app.use(express.json());

// allows cors requests
app.use(cors());

/* ROUTES */
// authentification
const authRouter = require('./routes/auth.js');

app.use('/api/auth', authRouter);

// box_arts
const boxArtRouter = require('./routes/boxArts.js');

app.use('/api/box_arts', boxArtRouter);

// profile
const profileRouter = require('./routes/profile.js');

app.use('/api/profile', profileRouter);

// Youtube
const youtubeRouter = require('./routes/youtube.js');

app.use('/api/youtube', youtubeRouter);

// Ebay
const EbayRouter = require('./routes/ebay.js');

app.use('/api/ebay', EbayRouter);

// RAWG
const RAWGRouter = require('./routes/rawg.js');

app.use('/api/rawg', RAWGRouter);

// static files
app.use(express.static('build'));

app.use(express.static('assets_minified_for_prod'));

// Basic html sending
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

// Error handling
app.use(errorHandling);

module.exports = app;
