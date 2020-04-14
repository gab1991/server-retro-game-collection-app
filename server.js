require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
var cors = require('cors');

// const db = mongoose.connect(
//   process.env.DATABASE_CLOUD_URL,
//   { useNewUrlParser: true, useUnifiedTopology: true },

//   () => console.log('db connected')
// );

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.set('useCreateIndex', true);
const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('db connected'));
console.log(db.profiles);
//allows server accepts jason
app.use(express.json());

//allows cors requests
app.use(cors());

//CREATING ROUTES

//subscribers
// const subscribersRouter = require('./routes/subscribers');
// app.use('/subscribers', subscribersRouter);

//box_arts
const boxArtRouter = require('./routes/boxArts.js');
app.use('/box_arts', boxArtRouter);

//authentification
const authRouter = require('./routes/auth.js');
app.use('/auth', authRouter);

//profile
const profileRouter = require('./routes/profile.js');
app.use('/profile', profileRouter);

//Youtube
const youtubeRouter = require('./routes/youtube.js');
app.use('/youtube', youtubeRouter);

//Ebay
const EbayRouter = require('./routes/ebay.js');
app.use('/ebay', EbayRouter);

//static files
app.use(express.static('assets'));

app.listen(8000, () => console.log('serv start'));
