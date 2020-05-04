const express = require('express');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const minisearh = require('minisearch');
const router = express.Router();

//getting an box_art
router.get('/:platform/:gameName', getBoxArt, (req, res) => {
  try {
    res.json(res.filePath);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getBoxArt(req, res, next) {
  const readdir = promisify(fs.readdir);
  // parametr difens the match of a search in minisearch library. The bigger the number the better the match
  const scoreThreshHold = 13;
  const host = req.get('host');
  const genericBox = `http://${host}/images/box_artworks/${req.params.platform}/generic_box.png`;
  let filePath;

  const regionsDir = path.resolve(
    __dirname,
    `../assets/images/box_artworks/${req.params.platform}/`
  );
  const platformDir = await readdir(regionsDir);
  const regions = platformDir
    .filter((item) => {
      const itemPath = path.resolve(regionsDir, item);
      return fs.lstatSync(itemPath).isDirectory();
    })
    .sort()
    .reverse();

  try {
    for (let i = 0; i < regions.length; i++) {
      const currentRegion = regions[i];
      const directory = path.resolve(
        __dirname,
        `../assets/images/box_artworks/${req.params.platform}/${currentRegion}`
      );
      const files = await readdir(directory);
      if (!files && i === regions.length - 1) {
        return res
          .status(404)
          .json({ message: `Cannot read files in catalogue ${directory}` });
      }

      const regexTrim = /.+?(?=\s\()/g;

      let filesObj = [];
      files.forEach((file, index) => {
        filesObj.push({
          id: index,
          name: file.toLowerCase().match(regexTrim)[0],
          link: file,
        });
      });

      miniSearch = new minisearh({
        fields: ['name'],
        storeFields: ['name', 'link'],
      });
      miniSearch.addAll(filesObj);

      let searchQuery = req.params.gameName.toLowerCase();
      let boxArts = miniSearch.search(searchQuery);
      if (boxArts[0] && boxArts[0].score > scoreThreshHold) {
        let bestMatchedhBox = boxArts[0];
        filePath = `http://${host}/images/box_artworks/${req.params.platform}/${currentRegion}/${bestMatchedhBox.link}`;
        break;
      }
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.filePath = filePath ? filePath : genericBox;
  next();
}

module.exports = router;
