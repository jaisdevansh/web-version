module.exports = {
  apps: [
    {
      name: 'entry-club-web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3001',
      instances: 1, // Run a single instance in fork mode for Windows stability
      exec_mode: 'fork', // Use fork mode instead of cluster for better compatibility
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ]
};
