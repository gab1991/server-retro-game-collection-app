require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.set('useCreateIndex', true);
const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('db connected'));

//allows server accepts jason
app.use(express.json());

//allows cors requests
app.use(cors());

//CREATING ROUTES

//box_arts
const boxArtRouter = require('./routes/boxArts.js');
app.use('/api/box_arts', boxArtRouter);

//authentification
const authRouter = require('./routes/auth.js');
app.use('/api/auth', authRouter);

//profile
const profileRouter = require('./routes/profile.js');
app.use('/api/profile', profileRouter);

//Youtube
const youtubeRouter = require('./routes/youtube.js');
app.use('/api/youtube', youtubeRouter);

//Ebay
const EbayRouter = require('./routes/ebay.js');
app.use('/api/ebay', EbayRouter);

//static files
app.use(express.static('build'));

app.use(express.static('assets'));

// Basic html sending
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log('serv start'));
