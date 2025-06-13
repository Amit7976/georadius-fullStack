import nodemailer from "nodemailer";
import { User } from "../models/userModel";
import crypto from "crypto";

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

export const sendEmail = async ({ email }: { email: string }) => {
  try {
    // console.log("🔹 Processing Temporary Password Request...");

    // Generate Secure Temporary Password
    const tempPassword = crypto.randomBytes(4).toString("hex"); // 8-character random password

    // Update User in Database (tempPassword Field)
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { tempPassword } },
      { new: true }
    );

    // console.log('====================================');
    // console.log(updatedUser);
    // console.log('====================================');

    if (!updatedUser) {
      throw new Error("User not found!");
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Nodemailer Transport for Brevo SMTP
    const transport = nodemailer.createTransport({
      host: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
      port: parseInt(process.env.BREVO_SMTP_PORT || "587"),
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
      },
      secure: false,
      tls: {
        rejectUnauthorized: false,
      },
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Email Content
    const mailOptions = {
      from: '"GeoRadiusNews Support" <guptaamit60600@gmail.com>',
      to: email,
      subject: "Your Temporary Password",
      html: `
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p>Hello,</p>
            <p>Your temporary password for GeoRadiusNews is:</p>
            <h2 style="color: #2E8B57;">${tempPassword}</h2>
            <p>Please log in using this password and change it immediately for security.</p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Regards,<br/>GeoRadiusNews Team</p>
        </body>
        </html>
      `,
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // console.log("Sending email to:", email);
    const mailResponse = await transport.sendMail(mailOptions);
    // console.log("Email sent successfully!");
    // console.log("Mail Response:", mailResponse);

    return mailResponse;
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error sending email:", errMsg);
    throw new Error(errMsg);
  }
};
