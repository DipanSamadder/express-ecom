const modemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async (data, req,  res) =>{
    const transporter = modemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_ID,
          pass: process.env.MP,
        },
      });
      
      async function main() {
        const info = await transporter.sendMail({
          from: process.env.MAIL_ID,
          to: data.to,
          subject: data.subject, 
          text: data.text, 
          html: data.html, 
        });

      
        console.log("Message sent: %s", data.to);
    }
    main().catch(console.error);
});

module.exports = {sendEmail};