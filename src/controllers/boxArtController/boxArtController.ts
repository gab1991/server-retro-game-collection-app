import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import Minisearh from 'minisearch';
import { asyncErrorCatcher } from 'utils/asyncErrorCatcher';
import { AppError } from 'utils/AppError';

const readdir = promisify(fs.readdir);

// parameter defines the match of a search in minisearch library. The bigger the number the better the match
const SCORE_THRESHOLD = 11;

interface IMinisearchInput {
  id: number;
  name: string | undefined;
  link: string;
}

const miniSearch = new Minisearh({
  fields: ['name'],
  storeFields: ['name', 'link'],
});

export const getBoxArt = asyncErrorCatcher(async (req, res) => {
  const host = req.get('host');
  const { gameName, platform } = req.params;

  if (!host) {
    throw new AppError('cannot get host out of req', 500);
  }

  const regionsDir = path.resolve(__dirname, `../../assets_minified_for_prod/images/box_artworks/${platform}/`);
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
    const directory = path.resolve(
      __dirname,
      `../../assets_minified_for_prod/images/box_artworks/${platform}/${region}`
    );
    filePromises.push(readdir(directory));
  });

  const files = await Promise.all(filePromises);

  if (!files.length) {
    throw new AppError(`Cannot read files in catalogue`, 500);
  }

  // Searching game name in file names
  for (let i = 0; i < files.length; i++) {
    const regexTrim = /.+?(?=\s\()/g;

    const minisearchInput: IMinisearchInput[] = [];

    files[i].forEach((file, index) => {
      minisearchInput.push({
        id: index,
        name: file.toLowerCase().match(regexTrim)?.[0],
        link: file,
      });
    });

    miniSearch.addAll(minisearchInput);
    const boxArts = miniSearch.search(gameName.toLowerCase());

    if (boxArts[0] && boxArts[0].score > SCORE_THRESHOLD) {
      const bestMatchedBox = boxArts[0];
      const filePath = `http://${host}/images/box_artworks/${platform}/${regions[i]}/${bestMatchedBox.link}`;
      const genericBox = `http://${host}/images/box_artworks/${platform}/generic_box.png`;

      res.set({
        'Cache-Control': 'public, max-age=604800', // one week cache
      });

      return res.json(filePath || genericBox);
    }
  }
});
