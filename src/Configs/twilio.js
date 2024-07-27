require('dotenv').config();
const twilioConfig = {
    tw_sid: process.env.TWILIO_ACCOUNT_SID,
    tw_auth: process.env.TWILIO_AUTH_TOKEN,
    tw_mobile: process.env.TWILIO_PHONE_NUMBER,
};

module.exports = twilioConfig;