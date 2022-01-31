const nodemailer = require("nodemailer");

const sendgridTransport = require("nodemailer-sendgrid");

const sendMail = async (options) => {
  // 1) Create a transporter to send email
  const transporter = nodemailer.createTransport(
    sendgridTransport({
      apiKey:
        "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",
    })
  );
  // 2) Define the email options
  const mailOptions = {
    from: "arskabinda@gmail.com",
    to: options.to,
    subject: options.subject,
    message: options.message,
    html: options.html,
  };
  // 3) Actually send the  email
  await transporter.sendMail(mailOptions);
};
module.exports = sendMail;
