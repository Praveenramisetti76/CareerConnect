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

export const sendCustomEmail = async (to, subject, html) => {
  await transporter.sendMail({
    to,
    subject,
    html,
  });
};

export const send2FAOtp = async (email, otp) => {
  await transporter.sendMail({
    to: email,
    subject: "Your CareerConnect 2FA Verification Code",
    html: `
      <p>Your verification code is:</p>
      <h2 style="font-size:2rem;letter-spacing:0.2em;">${otp}</h2>
      <p>This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
    `,
  });
};
