const express = require('express');
const fs = require('fs');
const path = require('path');
const minisearh = require('minisearch')
const router = express.Router();




//getting an box_art
router.get('/:platform/:gameName', getBoxArt, async (req, res) => {
    try {
        //Enabling CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
        res.json(res.filePath).send()
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Middleware
function getBoxArt(req, res, next) {
    // parametr difens the match of a search in minisearch library. The bigger the number the better the match
    console.log(req.params)
    const scoreThreshHold = 20;
    let filePath;
    let bestMatchedhBox;
    try {
        let directory = path.resolve(__dirname, `../assets/images/box_artworks/${req.params.platform}`);
        let files = fs.readdirSync(directory);

        if (!files) { return res.status(404).json({ message: `Cannot read files in catalogue ${directory}` }) }

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
            storeFields: ['name', 'link'],
            searchOptions: {
                tokenize: (string) => string.split(/[\s-]+/) // search query tokenizer
            }
        });
        miniSearch.addAll(filesObj);

        let searchQuery = req.params.gameName.toLowerCase();
        let boxArts = miniSearch.search(searchQuery);
        console.log(boxArts)
        if (boxArts[0].score > scoreThreshHold) {
            bestMatchedhBox = boxArts[0];
        }

        const host = req.get('host');
        filePath = `http://${host}/images/box_artworks/${req.params.platform}/${bestMatchedhBox.link}`;
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.filePath = filePath;
    next();
}



module.exports = router;
