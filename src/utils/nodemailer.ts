import nodemailer from 'nodemailer';
export const Transporter= nodemailer.createTransport({
   // host: "smtp-relay.sendinblue.com",//"smtp.gmail.com",
    port: 465,
   // port: 587, // true for 465, false for other ports
    service: 'gmail',
    host: 'smtp.gmail.com',

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    },
    secure: true,
  })

  