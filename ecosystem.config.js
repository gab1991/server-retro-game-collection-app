// to run pm2 production
// pm2 start ecosystem.config.js --env production

module.exports = {
  apps: [
    {
      name: 'retro-game-collection',
      script: './server.js',
      env: {
        NODE_ENV: 'development',
      },
      env_test: {
        NODE_ENV: 'test',
      },
      env_staging: {
        NODE_ENV: 'staging',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
