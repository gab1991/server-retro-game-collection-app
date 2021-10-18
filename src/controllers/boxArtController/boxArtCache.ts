import { AvailablePlatforms } from 'models/types';
import { set } from 'lodash';

type TBoxArtCache = { [platform in keyof AvailablePlatforms]?: { [game: string]: string } };

class BoxArtCache {
  private cache: TBoxArtCache = {};

  addEntry(platform: AvailablePlatforms, game: string, path: string) {
    set(this.cache, `${platform}.${game}`, path);
  }

  readEntry(platform: AvailablePlatforms, game: string): string | undefined {
    return this.cache?.[platform]?.[game];
  }
}

export const boxArtCache = new BoxArtCache();
