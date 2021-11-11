'use strict';

const slugify = require('slugify');

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
        data.slug = await getUniqueSlug(data.title);
      }
    },
    async beforeUpdate(params, data) {
      if (data.title) {
        data.slug = await getUniqueSlug(data.title);
      }
    },
  },
};
