module.exports = ({env}) => ({
  sentry: {
    // Add Sentry DSN from: https://sentry.io/settings/ipo-se/projects/backend/keys/
    dsn: 'https://f091ea00b30c4368b807caf475404bc0@o473428.ingest.sentry.io/5936188',
  },
  upload: {
    provider: 'cloudinary',
    providerOptions: {
      cloud_name: env('CLOUDINARY_NAME'),
      api_key: env('CLOUDINARY_KEY'),
      api_secret: env('CLOUDINARY_SECRET'),
    },
  },
});
