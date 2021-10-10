import mongoose from 'mongoose';

const db_url = process.env.NODE_ENV === 'production' ? process.env.DATABASE_CLOUD_URL : process.env.DATABASE_URL;

if (!db_url) {
  throw new Error('database url has not been provided');
}

mongoose.connect(`${db_url}`, {});

const db = mongoose.connection;

db.on('error', (err) => console.error(err));

db.once('open', () => console.info(`db connected || ${process.env.NODE_ENV?.toUpperCase()}`));
