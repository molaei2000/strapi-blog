module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  url: "/dashboard",
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
});
