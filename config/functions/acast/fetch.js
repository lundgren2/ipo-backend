'use strict';

const slugify = require('slugify');
const getJsonFromXml = require('../../../lib/xml2json');

const RSS_URL = 'https://rss.acast.com';

async function fetchDataForPodcast(podcastName) {
  console.log(`Fetching data for podcast: ${podcastName}`);
  const response = await getJsonFromXml(`${RSS_URL}/${podcastName}`);
  const podcastData = response.rss.channel;
  return podcastData;
}

function parseLinks(podcast) {
  const links = Array.isArray(podcast['atom:link'])
    ? podcast['atom:link'].map((link, i) => {
        return {
          title: i === 0 ? 'rss' : link._attributes.title,
          href: link._attributes.href,
        };
      })
    : [];

  return links;
}

function getCoverUrl(data) {
  // const downloaded = await strapi.config.functions.download(coverUrl);
  // console.log('downloaded', downloaded);

  // try {
  //   const res = await axios.post('http://localhost:1337/upload', {
  //     data: { files: fs.readFileSync(downloaded) },
  //   });
  // } catch (error) {
  //   // console.error(error);
  //   console.log('ERROR FFS :( ');
  // }

  // TODO: Fix upload image (buffersize is removed)
  // const [{ id: fileId }] = await strapi.config.functions.upload(downloaded);

  return data.image.url._text;
}

/**
 * Add podcast if it doesn't already exist
 *
 * @param {string} podcast
 */
async function addPodcast(podcast) {
  const episodeQuery = strapi.query('podcast-episode');
  const links = parseLinks(podcast);
  const coverUrl = getCoverUrl(podcast);
  const title = podcast.title._text;

  const isAlreadyAdded = await episodeQuery.findOne({
    title,
  });

  if (isAlreadyAdded) {
    return;
  }

  const podcastObject = {
    title,
    slug: slugify(title),
    description: podcast['itunes:summary']._text,
    descriptionHtml: podcast.description._cdata,
    website: podcast.link._text,
    links,
    coverUrl,
  };

  console.log(`Adding podcast ${podcastObject.title} to strapi`);
  await episodeQuery.create(podcastObject);
}

/**
 * Parse podcast episode
 *
 * @param {Object} episodes
 * @returns {Object} Object that includes {title, slug, summary, date, description, link and coverUrl}
 */
async function parseEpisodes(episodes) {
  const parsedEpisodes = episodes
    .map((episode) => {
      const title = episode.title._text;
      return {
        title,
        slug: slugify(title),
        summary: episode['itunes:subtitle']._text,
        date: new Date(episode.pubDate._text),
        description: episode['itunes:summary']._text,
        link: episode.link._text,
        coverUrl: episode['itunes:image']._attributes.href,
      };
    })
    .reverse();

  return parsedEpisodes;
}

/**
 * Iterates over all episodes and parses it and then add if episode.
 * Is not added.
 *
 * @param {Object} episodesData - Unparsed episode data
 */
async function addEpisodes(episodesData) {
  const episodeQuery = strapi.query('podcast-episode');
  const episodes = await parseEpisodes(episodesData);
  let insertedEpisodes = [];

  // Insert each element that doesn't exist
  for await (const episode of episodes) {
    // TODO: Check latest added episode and only add episodes after that
    // to optimize this function
    const isAlreadyAdded = await episodeQuery.findOne({
      title: episode.title,
    });
    if (isAlreadyAdded) {
      continue;
    }

    console.log(`Adding ${episode.title}`);
    await episodeQuery.create(episode);
    insertedEpisodes.push(episode.title);
  }

  return insertedEpisodes;
}

module.exports = async (podcastName) => {
  // Insert Podcast
  const podcast = await fetchDataForPodcast(podcastName);
  await addPodcast(podcast);

  // TODO: Move this logic to `podcast-episodes`
  // Insert Podcast Episodes
  const episodes = podcast.item;
  const insertedEpisodes = await addEpisodes(episodes);

  return JSON.stringify({
    totalInsertedEpisodes: insertedEpisodes.length,
    insertedEpisodes,
  });
};

// async function deleteAllEpisodes() {
//   const episodeQuery = strapi.query('podcast-episode');
//   const allEpisodes = await episodeQuery.find({ _limit: 5 });

//   allEpisodes.forEach(async (episode) => {
//     console.log(`Delete ${episode.id}`);
//     try {
//       await episodeQuery.delete({ id: episode.id });
//     } catch (err) {
//       console.error(err);
//     }
//   });
// }
