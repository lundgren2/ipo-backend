'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
module.exports = {
  // GET /podcasts/import

  /**
   * Import podcasts and return how many podcast episodes that is inserted.
   */
  import: async (ctx) => {
    // Fetch Market Makers
    const data = await strapi.config.functions.acast.fetch('marketmakers');
    ctx.send(data);
  },
};
