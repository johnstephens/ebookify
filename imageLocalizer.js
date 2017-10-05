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

    if (imageUrl.match(/^\/\//)) imageUrl = 'https:' + imageUrl;

    let protocol = imageUrl.match(/^(.*?)\:/)[1];

    const response = (imageUrl, res) => {

      console.log(`\n\nIMAGE URL: ${imageUrl}`);

      console.log('statusCode:', res.statusCode);

      new Promise(function(resolve, reject) {

        if(res.statusCode !== 200) {
          reject(res.statusCode);
        } else {
          resolve();
        }

      }).then(function() {

        let imageData = '';

        res.setEncoding('binary');

        res.on('data', chunk => { imageData += chunk; });

        res.on('end', () => {

          fs.writeFile(imageDir + '/' + filename, imageData, 'binary', (err) => {

            if(err) console.error(err);

            console.log('File downloaded at: ' + imageDir + '/' + filename);

            let thisImageUrl = new RegExp(/src\=["|'](.*?)["|']/).exec(parts[i])[1];

            parts[i] = parts[i].replace(thisImageUrl, imageDir + '/' + filename);

            processParts(parts, i + 1);

          });

        });

      }).catch(function(statusCode) {

        if (statusCode <= 300 || statusCode > 399) return;

        // let thisProtocol = imageUrl.match(/^(.*?)\:/)[1];

        // if (thisProtocol !== protocol) throw statusCode;

        if ( protocol === 'https' ) {

          let altImageUrl = imageUrl.replace('https', 'http');

          http.get(altImageUrl, (res) => {
            response(altImageUrl, res);
          }).on('error', (err) => {
            console.error(err);
          });


        } else if ( protocol === 'http' ) {

          let altImageUrl = imageUrl.replace('http', 'https');

          https.get(altImageUrl, (res) => {
            response(altImageUrl, res);
          }).on('error', (err) => {
            console.error(err);
          });

        }

      });

    }

    if ( protocol === 'https' ) {

      https.get(imageUrl, (res) => {
        response(imageUrl, res);
      }).on('error', (err) => {
        console.error(err);
      });

    } else if ( protocol === 'http' ) {

      http.get(imageUrl, (res) => {
        response(imageUrl, res);
      }).on('error', (err) => {
        console.error(err);
      });

    }

  }

  /**
   * This starts running through the script
   */

  splitImages(content);

}





module.exports = imageLocalizer;
