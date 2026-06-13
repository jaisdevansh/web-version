module.exports = {
  apps: [
    {
      name: 'entry-club-web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 'max', // Distributes traffic across all CPU cores
      exec_mode: 'cluster', // Enables Node.js cluster module for 10000+ users
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
