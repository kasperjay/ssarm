const nodemailer = require("nodemailer");

const getTransporter = () => {
  const host = process.env.SMTP_HOST || "mail.spacemail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = port === 465; // SSL for 465
  const user = process.env.SMTP_USER || "admin@spectralsound.works";
  const pass = process.env.SMTP_PASS || "k1TTENLL4M4$!";

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

const sendEmail = async (to, subject, html) => {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || '"Spectral Soundworks" <admin@spectralsound.works>';

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });

  return info;
};

module.exports = {
  getTransporter,
  sendEmail,
};
