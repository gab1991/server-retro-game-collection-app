require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const isProduction = process.env.NODE_ENV === 'production';

const db_url = isProduction ? process.env.DATABASE_CLOUD_URL : process.env.DATABASE_URL;

mongoose.connect(db_url, {});

const db = mongoose.connection;
db.on('error', (err) => console.error(err));

db.once('open', () => console.log(`db connected || ${process.env.NODE_ENV.toUpperCase()}`));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`serv started on port ${PORT}`));
