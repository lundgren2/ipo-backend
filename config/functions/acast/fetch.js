'use strict';

const getJsonFromXml = require('../../../lib/xml2json');
const toMarkdown = require('../../../lib/html2markdown');
const slugify = require('../../../lib/slugify');

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

function parseDescription(unformattedDescription, delimiter) {
  const descMd = toMarkdown(unformattedDescription);
  if (!delimiter) {
    return descMd;
  }
  const delimiterIndex = descMd.indexOf(delimiter);
  const description = descMd.substring(0, delimiterIndex);
  return description;
}

/**
 * Add podcast if it doesn't already exist
 *
 * @param {string} podcast
 */
async function addPodcast(podcast) {
  const podcastQuery = strapi.query('podcast');
  const links = parseLinks(podcast);
  const coverUrl = getCoverUrl(podcast);
  const title = podcast.title._text;

  const isAlreadyAdded = await podcastQuery.findOne({
    title,
  });

  if (isAlreadyAdded) {
    return isAlreadyAdded.id;
  }

  const podcastObject = {
    title,
    description: parseDescription(podcast.description._cdata),
    slug: slugify(title),
    summary: podcast['itunes:summary']._text,
    website: podcast.link._text,
    links,
    coverUrl,
  };

  console.log(`Adding podcast ${podcastObject.title} to strapi`);
  const insertedPodcast = await podcastQuery.create(podcastObject);
  return insertedPodcast.id;
}

/**
 * Parse podcast episode
 *
 * @param {Object} episodes
 * @returns {Object} Object that includes {title, slug, summary, date, description, link and coverUrl}
 */
async function parseEpisodes(episodes, podcastId) {
  const episodeQuery = strapi.query('podcast-episode');
  let podcastEpisodes = [];

  // TODO: Check latest added episode and only add episodes after that
  // to optimize this function.
  for await (const episode of episodes) {
    const title = episode.title._text;

    const isAlreadyAdded = await episodeQuery.findOne({
      title,
    });

    if (isAlreadyAdded) {
      continue;
    }

    const podcastEpisode = {
      title,
      slug: slugify(title),
      summary: episode['itunes:subtitle']._text,
      date: new Date(episode.pubDate._text),
      description: parseDescription(episode.description._cdata, '---'),
      link: episode.link._text,
      coverUrl: episode['itunes:image']._attributes.href,
      // TODO: check how to link podcast
      podcast: podcastId,
    };

    podcastEpisodes.push(podcastEpisode);
  }

  return podcastEpisodes.reverse();
}

/**
 * Iterates over all episodes and parses it and then add if episode
 * isn't added
 *
 * @param {Object} episodesData - Unparsed episode data
 * @returns {Object[]} Array with the inserted episodes
 */
async function addEpisodes(episodesData, podcastId) {
  const episodeQuery = strapi.query('podcast-episode');
  const episodes = await parseEpisodes(episodesData, podcastId);

  // Insert each element that doesn't exist
  for await (const episode of episodes) {
    console.log(`Adding ${episode.title}`);
    await episodeQuery.create(episode);
  }

  return episodes;
}

module.exports = async (podcastName) => {
  // await deleteAllEpisodes();

  // Insert Podcast
  const podcast = await fetchDataForPodcast(podcastName);
  const podcastId = await addPodcast(podcast);
  console.log('podcast ID: ', podcastId);

  // TODO: Move this logic to `podcast-episodes`
  // Insert Podcast Episodes
  const episodes = podcast.item;
  const insertedEpisodes = await addEpisodes(episodes, podcast.id);

  return JSON.stringify({
    totalInsertedEpisodes: insertedEpisodes.length,
    insertedEpisodes,
  });
};

// eslint-disable-next-line no-unused-vars
async function deleteAllEpisodes() {
  const episodeQuery = strapi.query('podcast-episode');
  const allEpisodes = await episodeQuery.find({_limit: 500});

  allEpisodes.forEach(async (episode) => {
    console.log(`Delete ${episode.id}`);
    try {
      await episodeQuery.delete({id: episode.id});
    } catch (err) {
      console.error(err);
    }
  });
}
