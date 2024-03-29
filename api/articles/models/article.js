'use strict';

const slugify = require('slugify');
const generateEmbedIframeFromUrl = require('../../../lib/generateEmbedIframe');

// https://www.gyanblog.com/javascript/strapi-nice-url-slug-configuration-seo/#generate-unique-slug-for-article
const getUniqueSlug = async (title, num = 0) => {
  let input = `${title}`;
  if (num > 0) {
    input = `${title}-${num}`;
  }
  const slug = slugify(input, {
    lower: true,
  });
  const [article] = await strapi.services.article.find({
    slug: slug,
  });
  if (!article) {
    return slug;
  } else {
    return getUniqueSlug(title, num + 1);
  }
};

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */
module.exports = {
  /**
   * Triggered before user creation.
   */
  lifecycles: {
    async beforeCreate(data) {
      if (data.title) {
        data.slug = await getUniqueSlug(data.slug || data.title);
      }
      // Replace URL with embed iframe
      if (data.body) {
        data.body = generateEmbedIframeFromUrl(data.body);
      }
    },
    async beforeUpdate(params, data) {
      const {id} = params;
      const existing = await strapi.query('article').findOne({id});
      if (existing.slug !== data.slug && data.title) {
        data.slug = await getUniqueSlug(data.slug || data.title);
      }
      // Replace URL with embed iframe
      if (data.body) {
        data.body = generateEmbedIframeFromUrl(data.body);
      }
    },
  },
};
