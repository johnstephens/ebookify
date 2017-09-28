const fs        = require('fs');
const http      = require('http');
const https     = require('https');
const path      = require('path');
const mathToPng = require('./mathToPng');





const imageLocalizer = (content, url) => {

  const imageDir = './images';

  if(!fs.existsSync(imageDir)) fs.mkdirSync(imageDir);

  function splitImages(content) {
    let parts = content.split(/(\<img.*?\/>)/g);
    processParts(parts, 0);
  }

  function processParts(parts, i) {

    if(parts[i]) {

      if(parts[i].match(/(\<img.*?\/>)/)) {

        let imageUrl = new RegExp(/src\=["|'](.*?)["|']/).exec(parts[i])[1];

        if(imageUrl) {

          console.log(`\n\nIMAGE URL: ${imageUrl}`);

          saveImage(imageUrl, parts, i);

        } else {

          processParts(parts, i + 1);

        }

      } else {

        processParts(parts, i + 1);

      }

    } else {

      const document = parts.join('');

      mathToPng(url, document);

    }

  }

  function saveImage(imageUrl, parts, i) {

    let filename = path.basename(imageUrl);

    let protocol = imageUrl.match(/^(.*?)\:/)[1];

    const response = (imageUrl, res) => {

      console.log(`\n\nIMAGE URL: ${imageUrl}`);

      console.log('statusCode:', res.statusCode);

      if(res.statusCode !== 200) throw imageUrl + ' does not exist. GAME OVER. ';

      let imageData = '';

      res.setEncoding('binary');

      res.on('data', chunk => { imageData += chunk; });

      res.on('end', () => {

        fs.writeFile(imageDir + '/' + filename, imageData, 'binary', (err) => {

          if(err) console.error(err);

          console.log('File downloaded at: ' + imageDir + '/' + filename);

          parts[i] = parts[i].replace(imageUrl, imageDir + '/' + filename);

          processParts(parts, i + 1);

        });

      });

    }

    if( protocol === 'https' ) {

      try {

        https.get(imageUrl, (res) => {
          response(imageUrl, res);
        }).on('error', (err) => {
          console.error(err);
        });

      }

      catch (e) {

        let altImageUrl = imageUrl.replace('https', 'http');

        http.get(altImageUrl, (res) => {
          response(altImageUrl, res);
        }).on('error', (err) => {
          console.error(err);
        });

      }

    }

    if( protocol === 'http' ) {

      try {

        http.get(imageUrl, (res) => {
          response(imageUrl, res);
        }).on('error', (err) => {
          console.error(err);
        });

      }

      catch (e) {

        let altImageUrl = imageUrl.replace('http', 'https');

        https.get(altImageUrl, (res) => {
          response(altImageUrl, res);
        }).on('error', (err) => {
          console.error(err);
        });

      }

    }

  }

  /**
   * This starts running through the script
   */

  splitImages(content);

}





module.exports = imageLocalizer;
