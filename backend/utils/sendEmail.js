import transporter from "../config/emailTransporter.js";

export const sendPasswordReset = async (email, resetURL) => {
  await transporter.sendMail({
    to: email,
    subject: "Password Reset Link",
    html: `
      <p>Click below to reset your password. This link is valid for 60 minutes:</p>
      <a href="${resetURL}">${resetURL}</a>
    `,
  });
};
