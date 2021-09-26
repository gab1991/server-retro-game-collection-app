import './env';
import './globals';
import mongoose from 'mongoose';
import { app } from './app';

const db_url = global.__IS_PROD__ ? process.env.DATABASE_CLOUD_URL : process.env.DATABASE_URL;

if (!db_url) {
  throw new Error('database url has not been provided');
}

mongoose.connect(`${db_url}`, {});

const db = mongoose.connection;

db.on('error', (err) => console.error(err));

db.once('open', () => console.info(`db connected || ${process.env.NODE_ENV?.toUpperCase()}`));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.info(`serv started on port ${PORT}`));
