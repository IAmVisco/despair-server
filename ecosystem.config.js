module.exports = {
  apps: [
    {
      name: 'd-server',
      script: './index.js',
      env: {
        NODE_ENV: 'production',
        WS_SERVER: 'https://ayamedespair.com',
      },
    },
  ],
};
