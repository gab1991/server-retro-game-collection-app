require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

let db_url;
if (process.env.NODE_ENV === 'production') {
  db_url = process.env.DATABASE_CLOUD_URL;
} else {
  db_url = process.env.DATABASE_URL;
}
mongoose.connect(db_url, {});

const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log(`db connected || ${process.env.NODE_ENV.toUpperCase()}`));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`serv started on port ${PORT}`));
