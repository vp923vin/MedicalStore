const twilio = require('twilio');
const twilioConfig = require('../../Configs/twilio');
const twilioClient = twilio(twilioConfig.tw_sid, twilioConfig.tw_auth);

const sendMobileMessage = async (message, mobile) => {
    const sendStatus = await twilioClient.messages.create({
        body: message,
        from: twilioConfig.tw_mobile,
        to: mobile
    });
    if(sendStatus)return true;
    return false;
};

module.exports = sendMobileMessage;