// to run pm2 production
// pm2 start ecosystem.config.js --env production

module.exports = {
  apps: [
    {
      name: 'retro-game-backend',
      script: './dist/server.js',
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
      out_file: '/dev/null',
      error_file: '/dev/null',
    },
  ],
};
