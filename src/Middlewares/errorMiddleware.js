// const fs = require('fs');
// const path = require('path');
// const { appConfig } = require('../Configs/app');

// const errorMiddleware = (err, req, res, next) => {
//   const env = appConfig.appEnvironment;
//   console.log(env); 
//   console.log('Error middleware hit'); 
//   if (env == 'Development') {
//     // Development environment: return error details
//     res.status(err.status || 500).json({
//       message: err.message,
//       stack: err.stack,
//     });
//   } else {
//     // Production environment: log error details to a file and return generic message
//     const logDir = path.join(__dirname, '..', '..', 'public', 'logs');
//     if (!fs.existsSync(logDir)) {
//       fs.mkdirSync(logDir, { recursive: true });
//     }
//     const logFile = path.join(logDir, `${new Date().toISOString().split('T')[0]}_log_file.txt`);
//     const logMessage = `${new Date().toISOString()} - ${err.message}\n${err.stack}\n\n`;
//     fs.appendFileSync(logFile, logMessage, 'utf8');

//     res.status(err.status || 500).json({
//       message: 'An error occurred. Please try again later.',
//     });
//   }
// };

// module.exports = errorMiddleware;

const fs = require('fs');
const path = require('path');
const { appConfig } = require('../Configs/app');

// Helper function to log errors
const logError = (logFilePath, logData) => {
    fs.appendFile(logFilePath, JSON.stringify(logData) + '\n', (error) => {
        if (error) {
            console.error('Error writing to log file', error);
        }
    });
};

const errorMiddleware = (err, req, res, next) => {
    const isProduction = appConfig.appEnvironment == 'Production';
    const timestamp = new Date().toISOString();

    // Determine the status code
    const statusCode = err.status || 500;

    // Error log details
    const errorLog = {
        message: err.message,
        stack: err.stack,
        timestamp: timestamp,
        path: req.originalUrl,
        method: req.method,
    };

    // Log error to error_log file
    logError(path.join(__dirname, '../../public/logs/error_log.txt'), errorLog);

    // Activity log details
    const activityLog = {
        method: req.method,
        path: req.originalUrl,
        status: statusCode,
        timestamp: timestamp,
    };

    // Log activity to run_log file
    logError(path.join(__dirname, '../../public/logs/run_log.txt'), activityLog);

    // Error response based on status code and environment
    let errorResponse;
    if (isProduction) {
        switch (statusCode) {
            case 404:
                errorResponse = { error: 'Resource not found.', status: 404 };
                break;
            case 402:
                errorResponse = { error: 'Payment required.', status: 402 };
                break;
            case 403:
                errorResponse = { error: 'Forbidden.', status: 403 };
                break;
            case 405:
                errorResponse = { error: 'Method not allowed.', status: 405 };
                break;
            case 500:
            default:
                errorResponse = { error: 'An internal server error occurred. Please try again later.', status: 500 };
                break;
        }
    } else {
        errorResponse = {
            error: err.message,
            stack: err.stack,
            status: statusCode,
        };
    }

    res.status(statusCode).send(errorResponse);
};

module.exports = errorMiddleware;

