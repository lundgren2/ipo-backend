module.exports = ({env}) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  cron: {
    enabled: process.env.NODE_ENV === 'production' ? true : false,
  },
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'd64bf9b2e1cc4cb856db3ae2633c3074'),
    },
  },
});
