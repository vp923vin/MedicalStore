require('dotenv').config();
const emailConfigs = {
    mailer: process.env.MAIL_MAILER,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
    encryption: process.env.MAIL_ENCRYPTION,
    address: process.env.MAIL_FROM_ADDRESS,
    platform: process.env.MAIL_FROM_NAME
  };
module.exports = { emailConfigs };
  
