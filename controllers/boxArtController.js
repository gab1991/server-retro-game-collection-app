const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const Minisearh = require('minisearch');

const readdir = promisify(fs.readdir);

const getBoxArt = async (req, res) => {
  // parameter defines the match of a search in minisearch library. The bigger the number the better the match
  const scoreThreshHold = 11;
  const host = req.get('host');
  const genericBox = `http://${host}/images/box_artworks/${req.params.platform}/generic_box.png`;
  let filePath;

  const regionsDir = path.resolve(__dirname, `../assets_minified_for_prod/images/box_artworks/${req.params.platform}/`);
  const platformDir = await readdir(regionsDir);
  const regions = platformDir
    .filter((item) => {
      const itemPath = path.resolve(regionsDir, item);
      return fs.lstatSync(itemPath).isDirectory();
    })
    .sort()
    .reverse();

  try {
    // const promsies = [];

    for (let i = 0; i < regions.length; i++) {
      const currentRegion = regions[i];
      const directory = path.resolve(
        __dirname,
        `../assets_minified_for_prod/images/box_artworks/${req.params.platform}/${currentRegion}`
      );

      const files = await readdir(directory);
      if (!files && i === regions.length - 1) {
        return res.status(404).json({ message: `Cannot read files in catalogue ${directory}` });
      }

      const regexTrim = /.+?(?=\s\()/g;

      const filesObj = [];
      files.forEach((file, index) => {
        filesObj.push({
          id: index,
          name: file.toLowerCase().match(regexTrim)[0],
          link: file,
        });
      });

      const miniSearch = new Minisearh({
        fields: ['name'],
        storeFields: ['name', 'link'],
      });
      miniSearch.addAll(filesObj);

      const searchQuery = req.params.gameName.toLowerCase();
      const boxArts = miniSearch.search(searchQuery);
      if (boxArts[0] && boxArts[0].score > scoreThreshHold) {
        const bestMatchedhBox = boxArts[0];
        filePath = `http://${host}/images/box_artworks/${req.params.platform}/${currentRegion}/${bestMatchedhBox.link}`;
        break;
      }
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.filePath = filePath || genericBox;
  res.set({
    'Cache-Control': 'public, max-age=604800', // one week cache
  });
  return res.json(res.filePath);
};

module.exports = {
  getBoxArt,
};
