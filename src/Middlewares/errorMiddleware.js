// middlewares/errorHandler.js
const fs = require('fs');
const path = require('path');
const { appConfig } = require('../Configs/app');

// Ensure the log directory exists
const logDirectory = path.join(__dirname, '../../public/log');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const logError = (err, req, res, next) => {
  const logFilePath = appConfig.appEnvironment === 'Production' ?
    path.join(logDirectory, 'production_error_log.log') :
    path.join(logDirectory, 'development_error_log.log');

  const errorEntry = `${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${req.ip}\nError: ${err.message}\nStack: ${err.stack}\n\n`;

  fs.appendFile(logFilePath, errorEntry, (err) => {
    if (err) {
      console.error('Failed to write to error log file', err);
    }
  });

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    error: {
      message: err.message,
      ...(appConfig.appEnvironment === 'Development' && { stack: err.stack }),
    }
  });
};

module.exports = logError;
