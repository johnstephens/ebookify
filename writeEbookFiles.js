/**
 * writeEbookFiles.js
 */

const exec                   = require('child_process').exec;
const sys                    = require('sys');
const ebook_convert_path     = require('./ebookify.config').ebook_convert_path;
const ebook_cover_url        = require('./ebookify.config').ebook_cover_url;
const chapter_break_elements = require('./ebookify.config').chapter_break_elements;





function writeEbookFiles(htmlfilename) {

  const epubfilename = htmlfilename.replace(/\.html$/, '.epub');
  const mobifilename = htmlfilename.replace(/\.html$/, '.mobi');

  const puts = (err, stdout, stderr) => {
    if(err) console.error(err);
    sys.puts(stdout);
  }

  let cover_flag    = '';

  if(ebook_cover_url) {
    cover_flag = ' --cover ' + ebook_cover_url;
  }

  exec(ebook_convert_path + ' ./' + htmlfilename + ' ./' + epubfilename + cover_flag + ' --preserve-cover-aspect-ratio --chapter "//*[name()=\'' + chapter_break_elements + '\']" --page-breaks-before "//*[name()=\'' + chapter_break_elements + '\']"', puts);

  exec(ebook_convert_path + ' ./' + htmlfilename + ' ./' + mobifilename + cover_flag + ' --output-profile kindle --no-inline-toc --chapter "//*[name()=\'' + chapter_break_elements + '\']" --page-breaks-before "//*[name()=\'' + chapter_break_elements + '\']"', puts);

}





module.exports = writeEbookFiles;
