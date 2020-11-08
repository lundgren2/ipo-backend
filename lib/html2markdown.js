const TurndownService = require('turndown');
const prettier = require('prettier');
const turndownService = new TurndownService();

/**
 * Converts HTML to Markdown.
 *
 * @param {string} html - HTML content
 * @returns {string} Markdown
 */
module.exports = function toMarkdown(html) {
  const unformattedMarkdown = turndownService.turndown(html);
  const markdown = prettier.format(unformattedMarkdown, {parser: 'markdown'});
  return markdown;
};
