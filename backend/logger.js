// backend/logger.js
const winston = require('winston');
const path = require('path');

// Ensure logs go to file and console
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    // Log to file (Loki will pick this up)
    new winston.transports.File({
      filename: '/var/log/backend/app.log', // MUST match agent-config.yaml
    }),
    // Also log to console (for dev)
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

module.exports = logger;
