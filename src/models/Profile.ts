import mongoose from 'mongoose';
import validator from 'validator';
import { IEbayOffer, IGame, IPlatform, IProfile } from './types';

const ebayOffersSchema = new mongoose.Schema<IEbayOffer>({
  id: { type: String },
  date: { type: Date, default: new Date() },
});

const gameSchema = new mongoose.Schema<IGame>({
  slug: { type: String, requred: true },
  name: { type: String, requred: true },
  date: { type: Date, default: new Date() },
  isShowEbay: { type: Boolean, default: true },
  watchedEbayOffers: [ebayOffersSchema],
});

const platfromSchema = new mongoose.Schema<IPlatform>({
  name: { type: String, requred: true },
  games: [gameSchema],
});

const profileSchema = new mongoose.Schema<IProfile>({
  username: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
    minlength: 1,
  },
  password: {
    type: String,
    required: true,
    maxLength: 1024,
    minlength: 4,
    select: false,
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, 'Your email is not valid'],
  },
  createdDate: {
    type: Date,
    required: true,
    default: new Date(),
  },
  owned_list: {
    platforms: [platfromSchema],
  },
  wish_list: {
    platforms: [platfromSchema],
  },
});

export const Profile = mongoose.model<IProfile>('Profile', profileSchema);
