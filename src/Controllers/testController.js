const { sendMail } = require('../Services/Utils/mailService');
const ejs = require('ejs');
const path = require('path');
const { appConfig } = require('../Configs/app');

const sendWelcomeEmail = async (req, res) => {
  try {
    const { email, name } = req.body;
    const emailTemplatePath = path.join(__dirname, '..', 'Views', 'emails', 'testEmail.ejs');
    
    const emailTemplate = await ejs.renderFile(emailTemplatePath, { name, appName: appConfig.appName });
    const subject = 'Welcome to Our Service';
    const text = 'Welcome to our service!';
    await sendMail(email, subject, text, emailTemplate);

    res.status(200).json({ message: 'Welcome email sent successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send welcome email.', error: error.message });
  }
};

module.exports = {
  sendWelcomeEmail,
};
