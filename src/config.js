module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: "postgresql://admin@localhost/collaborator",
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3d',
}