'use strict';

const axios = require('axios');
const xml2json = require('xml-js').xml2json;

module.exports = async (url) => {
  const { data } = await axios.get(url);
  return JSON.parse(xml2json(data, { compact: true }));
};
