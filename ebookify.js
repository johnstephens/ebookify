#! /usr/bin/env node

/**
 * ebookify.js
 */

// const fs             = require('fs');
const request        = require('request');
const imageLocalizer = require('./imageLocalizer');

const config         = require('./ebookify.config');
const urls           = require('./urls.json');





const ebookify = () => {

  'use strict';





  if(!config.ebook_convert_path) throw 'Please edit ebookify.config.js and add path to ebook-convert script.';





  urls.forEach((url) => {

    request(url, (err, res, content) => {

      if(err) console.error(err);

      console.log('statusCode:', res && res.statusCode);

      if(!content) throw `url[ ${url} ] has no body!`;

      // TODO Add callbacks for exec to check if both ebook files exist, then delete HTML src file?

      imageLocalizer(content, url);

    });

  });

}





ebookify();
