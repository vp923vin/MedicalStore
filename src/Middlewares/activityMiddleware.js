// middlewares/activityLogger.js
const fs = require('fs');
const path = require('path');
const { appConfig } = require('../Configs/app');

// Ensure the log directory exists
const logDirectory = path.join(__dirname, '../../public/log');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const logActivity = (req, res, next) => {
  const logFilePath = appConfig.appEnvironment === 'Production' ?
    path.join(logDirectory, 'production_activity_log.log') :
    path.join(logDirectory, 'development_activity_log.log');

  const startLogEntry = `${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${req.ip}${req.user ? ` - User: ${req.user.id} (${req.user.username})` : ''} - Request started\n`;

  fs.appendFile(logFilePath, startLogEntry, (err) => {
    if (err) {
      console.error('Failed to write to log file', err);
    }
  });

  res.on('finish', () => {
    const endLogEntry = `${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${req.ip}${req.user ? ` - User: ${req.user.id} (${req.user.username})` : ''} - Status: ${res.statusCode} - Request ended\n`;

    fs.appendFile(logFilePath, endLogEntry, (err) => {
      if (err) {
        console.error('Failed to write to log file', err);
      }
    });
  });

  next();
};

module.exports = logActivity;
