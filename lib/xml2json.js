'use strict';

const axios = require('axios');
const xml2json = require('xml-js').xml2json;

module.exports = async (url) => {
  const response = await axios.get(url);
  return JSON.parse(xml2json(response.data, {compact: true}));
};
