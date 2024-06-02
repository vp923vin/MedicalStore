const nodemailer = require('nodemailer');
const { emailConfigs } = require('../../Configs/emails');
const { appConfig } = require('../../Configs/app');

const transporter = nodemailer.createTransport({
  host: emailConfigs.host,
  port: emailConfigs.port,
  secure: emailConfigs.secure,
  auth: {
    user: emailConfigs.username,
    pass: emailConfigs.password,
  },
});

const sendMail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"${appConfig.appName}" <${emailConfigs.username}>`, 
      to, 
      subject, 
      text, 
      html, 
    });
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendMail,
};
