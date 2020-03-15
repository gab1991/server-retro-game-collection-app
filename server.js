require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', err => console.error(err));
db.once('open', () => console.log('db connected'));

//allows server accepts jason
app.use(express.json());

//CREATING ROUTES

//subscribers
// const subscribersRouter = require('./routes/subscribers');
// app.use('/subscribers', subscribersRouter);

//box_arts
const boxArtRouter = require('./routes/boxArts.js');
app.use('/box_arts', boxArtRouter);

//static files
app.use(express.static('assets'));


app.listen(8000, () => console.log('serv start'));
