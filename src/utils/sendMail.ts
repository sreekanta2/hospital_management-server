import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  ignoreTLS: false,
  auth: {
    user: "shreekantaray@gmail.com",
    pass: "X2sPtB64SZJHbW8T",
  },
});
export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<string | null> => {
  const info = await transporter.sendMail({
    from: "shreekantaray@gmail.com",
    to: to,
    subject: subject,
    html: html,
  });

  return info?.messageId;
};
