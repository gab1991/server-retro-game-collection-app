const express = require('express');
const fs = require('fs');
const path = require('path');
const minisearh = require('minisearch');
const router = express.Router();

//getting an box_art
router.get('/:platform/:gameName', getBoxArt, async (req, res) => {
  try {
    //Enabling CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'origin, content-type, accept'
    );
    res.json(res.filePath).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Middleware
function getBoxArt(req, res, next) {
  // parametr difens the match of a search in minisearch library. The bigger the number the better the match
  console.log(req);

  const scoreThreshHold = 13;
  const host = req.get('host');
  const genericBox = `http://${host}/images/box_artworks/${req.params.platform}/generic_box.png`;
  let filePath;

  let regions = ['USA', 'Japan'];

  try {
    for (let i = 0; i < regions.length; i++) {
      const currentRegion = regions[i];
      const directory = path.resolve(
        __dirname,
        `../assets/images/box_artworks/${req.params.platform}/${currentRegion}`
      );
      const files = fs.readdirSync(directory);
      console.log(directory);

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
          link: file
        });
      });
      // console.log(filesObj);

      miniSearch = new minisearh({
        fields: ['name'],
        storeFields: ['name', 'link']
      });
      miniSearch.addAll(filesObj);

      let searchQuery = req.params.gameName.toLowerCase();
      let boxArts = miniSearch.search(searchQuery);
      console.log(boxArts);
      if (boxArts[0] && boxArts[0].score > scoreThreshHold) {
        console.log('here');
        console.log(boxArts);
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
