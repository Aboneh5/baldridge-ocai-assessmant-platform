module.exports = {
  apps: [
    {
      name: 'tenadam-assessment',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3010',
      instances: 'max',  // Use all available CPU cores (was: 1)
      exec_mode: 'cluster',  // Enable cluster mode for better performance
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3010,
        NODE_OPTIONS: '--max-old-space-size=2048'  // Optimize memory usage
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      time: true,
      // Performance optimizations
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],

  deploy: {
    production: {
      user: 'your-username',
      host: 'your-vps-ip',
      ref: 'origin/main',
      repo: 'git@github.com:your-username/tenadam-assessment.git',
      path: '/var/www/tenadam-assessment',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run db:generate && npm run db:deploy && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};




