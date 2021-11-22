const slugifyFn = require('slugify');

// Set default to slugify
const slugify = (str, options = {lower: true, strict: true}) => {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string', str);
  }
  return slugifyFn(String(str), options);
};

module.exports = slugify;
