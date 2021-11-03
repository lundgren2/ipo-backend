module.exports = ({env}) => ({
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
