'use strict';

const axios = require('axios');

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#cron-tasks
 */

module.exports = {
  /**
   * Update articles.
   * Every minute.
   */
  '*/1 * * * *': async () => {
    try {
      await axios.get('http://ipo-news-updater/import/articles');
    } catch (error) {
      console.error(error);
    }
  },
};
