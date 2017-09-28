const mathify       = require('mathjax-node-svg2png');
const writeHTMLFile = require('./writeHTMLFile');





mathify.config({
  MathJax: {
    fontURL: './node_modules/mathjax/fonts/HTML-CSS'
  }
});

mathify.start();





function splitMath(content, url) {

  const re = /(\<mml:math.*?\<\/mml:math\>)/g;

  let parts = content.split(re);

  processParts(parts, 0, url);

}

function processParts(parts, i, url) {

  if(parts[i]) {

    if(parts[i].match(/(\<mml:math.*?\<\/mml:math\>)/)) {

      typesetMath(parts[i], parts, i, url);

    } else {

      processParts(parts, i + 1, url);

    }

  } else {

    const document = parts.join('');

    writeHTMLFile(url, document);

  }

}

function typesetMath(formula, parts, i, url) {

  mathify.typeset({
    math: formula,
    format: 'MathML',
    png: true,
    scale: 2.6666666666666666
  }, function(data) {

    if(data.errors) {

      console.error(data.errors);

    } else {

      const imageTag = `<img alt="${data.speakText}" src="${data.png}" style="max-width: 99%" width="${data.pngWidth / 2}"/>`;

      parts[i] = imageTag;

      processParts(parts, i + 1, url);

    }

  });

}





const mathToPng = (url, content) => {
  splitMath(content, url);
}





module.exports = mathToPng;
