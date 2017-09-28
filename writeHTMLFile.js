/**
 * writeHTMLFile.js
 */

const fs              = require('fs');
const path            = require('path');
const writeEbookFiles = require('./writeEbookFiles');





const nameChanger = (url) => {

  let basename = path.basename(url);

  let argumentsRemoved = basename.replace(/\?.*?$/, '.html');

  return argumentsRemoved;

};

function writeHTMLFile(url, document) {

  const htmlfilename = nameChanger(url);

  fs.writeFile('./' + htmlfilename, document, (err) => {

    if(err) console.error(err);

    console.log('The file ' + htmlfilename + ' was saved!');

    writeEbookFiles(htmlfilename);

  });

}





module.exports = writeHTMLFile;
