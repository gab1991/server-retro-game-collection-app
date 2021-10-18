import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import Minisearh from 'minisearch';
import { asyncErrorCatcher } from 'utils/asyncErrorCatcher';
import { AppError } from 'utils/AppError';
import { isAvailablePlatform } from 'typings/typeguards';
import { TGetBoxArtHanler } from './types';
import { boxArtCache } from './boxArtCache';

const readdir = promisify(fs.readdir);

// parameter defines the match of a search in minisearch library. The bigger the number the better the match
const SCORE_THRESHOLD = 11;
const REL_PATH = '../../../assets_minified_for_prod/images/box_artworks';

interface IMinisearchInput {
  id: string;
  name: string | undefined;
  path: string;
}

export const getBoxArt = asyncErrorCatcher<TGetBoxArtHanler>(async (req, res) => {
  const host = req.get('host');
  const { gameName, platform } = req.params;

  if (!isAvailablePlatform(platform)) {
    throw new AppError('wrong platform', 400);
  }

  const cached = boxArtCache.readEntry(platform, gameName);

  if (cached) {
    return res.json({ status: 'success', payload: cached });
  }

  const regionsDir = path.resolve(__dirname, `${REL_PATH}/${platform}/`);
  const platformDir = await readdir(regionsDir);
  const regions = platformDir
    .filter((item) => {
      const itemPath = path.resolve(regionsDir, item);
      return fs.lstatSync(itemPath).isDirectory();
    })
    .sort()
    .reverse();

  // Reading files for each region
  const filePromises: Promise<string[]>[] = [];

  regions.forEach((region) => {
    const directory = path.resolve(__dirname, `${REL_PATH}/${platform}/${region}`);
    filePromises.push(readdir(directory));
  });

  const files = await Promise.all(filePromises);

  if (!files.length) {
    throw new AppError(`Cannot read files in catalogue`, 500);
  }

  // Searching game name in file names
  for (let i = 0; i < files.length; i++) {
    const regexTrim = /.+?(?=\s\()/g;

    const miniSearch = new Minisearh({
      fields: ['name'],
      storeFields: ['name', 'path'],
    });

    const minisearchInput: IMinisearchInput[] = [];

    files[i].forEach((file) => {
      minisearchInput.push({
        id: file,
        name: file.toLowerCase().match(regexTrim)?.[0],
        path: file,
      });
    });

    miniSearch.addAll(minisearchInput);
    const boxArts = miniSearch.search(gameName.toLowerCase());

    if (boxArts[0] && boxArts[0].score > SCORE_THRESHOLD) {
      const bestMatchedBox = boxArts[0];
      const filePath = `http://${host}/images/box_artworks/${platform}/${regions[i]}/${bestMatchedBox.path}`;

      res.set({
        'Cache-Control': 'public, max-age=604800', // one week cache
      });
      boxArtCache.addEntry(platform, gameName, filePath);
      return res.json({ status: 'success', payload: filePath });
    }
  }

  const genericBox = `http://${host}/images/box_artworks/${platform}/generic_box.png`;
  boxArtCache.addEntry(platform, gameName, genericBox);
  return res.json({ status: 'success', payload: genericBox });
});
