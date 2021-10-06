import { AvailablePlatforms } from 'models/types';

export const isAvailablePlatform = (platform: string): platform is AvailablePlatforms => {
  return !!AvailablePlatforms[platform];
};
