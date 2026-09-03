const nodemailer = require('nodemailer');

let cachedTransporter = null;

const getTransporter = async () => {
  if (cachedTransporter) return cachedTransporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    try {
      const testAccount = await nodemailer.createTestAccount();
      cachedTransporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (err) {
      console.warn("Could not create ethereal test account:", err.message);
      return null;
    }
  }
  return cachedTransporter;
};

const sendEmail = async (options) => {
  try {
    if (!options.email) return;

    if (process.env.NODE_ENV === 'test' || process.env.E2E_TEST === 'true') {
      return; // Skip slow remote SMTP calls in automated test environments
    }

    const transporter = await getTransporter();
    if (!transporter) return;

    const info = await transporter.sendMail({
      from: '"Valet Parking System" <no-reply@valetparking.com>',
      to: options.email, 
      subject: options.subject, 
      html: options.html,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.warn("Error sending email:", error.message);
  }
};

module.exports = sendEmail;
