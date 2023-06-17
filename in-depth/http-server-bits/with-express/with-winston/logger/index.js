const winston = require('winston');

let logger;
function registerLogger() { 
  console.log('registering winston logger')
  const LOG_FILES = {
    root: 'logs',
    error: 'error.log',
    combined: 'combined.log'
  }
  
  logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'web-api' },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.File({
        filename: `${LOG_FILES.root}/${LOG_FILES.error}`,
        level: 'error',
      }),
      new winston.transports.File({ filename: `${LOG_FILES.root}/${LOG_FILES.combined}` }),
    ],
  });

  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    );
  }
  logger.info('done registering logger')
  
}

function getLogger() { 
  return logger
}

module.exports.registerLogger = registerLogger;
module.exports.logger = logger;
module.exports.getLogger = getLogger;