import { transporter } from "../config/emailTransporter";

const sendPasswordReset = async (email : string, resetURL : string) => {
  await transporter.sendMail({
    to: email,
    subject: `Passowrd Reset Link`,
    html: `
        <p>Click below to reset your password. This link is valid for 60 minutes:</p>
        <a href="${resetURL}">${resetURL}</a>
      `,
  });
};

export { sendPasswordReset };