import nodemailer from "nodemailer";
import { User } from "../models/userModel";
import crypto from "crypto";

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const sendEmail = async ({ email }: { email: string }) => {
  try {
    console.log("🔹 Processing Temporary Password Request...");

    // ✅ Generate Secure Temporary Password
    const tempPassword = crypto.randomBytes(4).toString("hex"); // 8-character random password

    // ✅ Update User in Database (tempPassword Field)
    const updatedUser = await User.findOneAndUpdate(
      { email }, // Find user by email
      { $set: { tempPassword } }, // Save temporary password
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("❌ User not found!");
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // ✅ Nodemailer Transport
   const transport = nodemailer.createTransport({
     host: process.env.MAILTRAP_HOST,
     port: parseInt(process.env.MAILTRAP_PORT || "2525"),
     auth: {
       user: process.env.MAILTRAP_USER,
       pass: process.env.MAILTRAP_PASS,
     },
     tls: {
       rejectUnauthorized: false, // 🔹 SSL issue fix
     },
   });


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // ✅ Email Content
    const mailOptions = {
      from: '"GeoRadiusNews Support" <support@yourdomain.com>',
      to: email,
      subject: "🔐 Your Temporary Password",
      html: `
        <html>
        <body>
            <p>Hello,</p>
            <p>Your temporary password for login is:</p>
            <h2>${tempPassword}</h2>
            <p>Please change your password after logging in.</p>
            <p>Best regards,<br>The GeoRadiusNews Team</p>
        </body>
        </html>
      `,
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    console.log("📩 Sending email to:", email);
    const mailResponse = await transport.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    console.log("📨 Mail Response:", mailResponse);

    return mailResponse;
  } catch (error: any) {
    console.error("❌ Error sending email:", error.message);
    throw new Error(error.message);
  }
};
