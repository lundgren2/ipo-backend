const slugifyFn = require('slugify');

// Set default to slugify
const slugify = (str, options = { lower: true, strict: true }) => {
  return slugifyFn(str, options);
};

module.exports = slugify;
