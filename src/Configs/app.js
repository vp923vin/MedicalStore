require('dotenv').config();
const appConfig = {
    url: process.env.APP_LOCAL_URI,
    port: process.env.APP_PORT,
    appName: process.env.APP_NAME,
    appVersion: process.env.APP_VERSION,
    appEnvironment: process.env.APP_ENVIRONMENT
};

module.exports = { appConfig };