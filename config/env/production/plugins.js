const version = require('../../../package.json').version;

// Add Sentry DSN from: https://sentry.io/settings/ipo-se/projects/backend/keys/
const SENTRY_DSN =
  'https://f091ea00b30c4368b807caf475404bc0@o473428.ingest.sentry.io/5936188';

module.exports = ({env}) => ({
  sentry: {
    dsn: env('NODE_ENV') === 'production' ? SENTRY_DSN : null,
    init: {
      release: `@sentry/browser@${version}`,
    },
  },
  upload: {
    provider: 'do',
    providerOptions: {
      key: env('DO_SPACE_ACCESS_KEY'),
      secret: env('DO_SPACE_SECRET_KEY'),
      endpoint: 'fra1.digitaloceanspaces.com',
      space: 'ipo-cdn',
      directory: 'v1',
      cdn: 'cdn.ipo.se',
    },
  },
});
