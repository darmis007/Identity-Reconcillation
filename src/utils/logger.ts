// utils/logger.ts

import winston from 'winston';

// Configure the logger
const logger = winston.createLogger({
  level: 'info', // Set log level as per your requirement
  format: winston.format.json(),
  transports: [
    new winston.transports.Console()
  ]
});

export default logger;
