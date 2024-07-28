const twilio = require('twilio');
const twilioConfig = require('../../Configs/twilio');
const twilioClient = twilio(twilioConfig.tw_sid, twilioConfig.tw_auth);

const sendMobileMessage = async (message, mobile) => {
    const verifiedMobile = await checkMobileCountryCode(mobile)
    try {
        const sendStatus = await twilioClient.messages.create({
            body: message,
            from: twilioConfig.tw_mobile,
            to: verifiedMobile
        });
        if (sendStatus && sendStatus.sid) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error sending SMS:", error);
        return false;
    }
};

const checkMobileCountryCode = async (mobile) => {
    phoneNumber = mobile.replace(/\D/g, '');
    countryCode = 91;
    // Add country code if not present
    if (!phoneNumber.startsWith(countryCode)) {
        phoneNumber = countryCode + phoneNumber;
    }

    // Ensure it starts with a '+'
    if (!phoneNumber.startsWith('+')) {
        phoneNumber = '+' + phoneNumber;
    }
    return phoneNumber;
};
module.exports = sendMobileMessage;