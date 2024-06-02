const fs = require('fs');
const path = require('path');
const { appConfig } = require('../Configs/app');

const errorMiddleware = (err, req, res, next) => {
  const env = appConfig.appEnvironment;
  console.log(env); 
  console.log('Error middleware hit'); 
  if (env == 'Development') {
    // Development environment: return error details
    res.status(err.status || 500).json({
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production environment: log error details to a file and return generic message
    const logDir = path.join(__dirname, '..', '..', 'public', 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logFile = path.join(logDir, `${new Date().toISOString().split('T')[0]}_log_file.txt`);
    const logMessage = `${new Date().toISOString()} - ${err.message}\n${err.stack}\n\n`;
    fs.appendFileSync(logFile, logMessage, 'utf8');

    res.status(err.status || 500).json({
      message: 'An error occurred. Please try again later.',
    });
  }
};

module.exports = errorMiddleware;

