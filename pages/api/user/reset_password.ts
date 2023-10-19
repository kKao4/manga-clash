import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import {  NormalResponse } from "@/type";
import User, { UserType } from "@/models/user";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

const transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  // secure: true,
  auth: {
    user: "thanh291100@gmail.com",
    pass: "SqfhrwRZ1m8z5jng",
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NormalResponse>
) {
  try {
    await dbConnect();
    const method = req.method;
    switch (method) {
      case "POST": {
        const form = formidable({});
        const [fields, files] = await form.parse(req);
        console.log("🚀 ~ file: reset_password.ts:36 ~ fields:", fields);
        if (fields.email) {
          const email = fields.email[0];
          const user: UserType | null = await User.findOne({ email: email });
          if (user) {
            const resetPasswordToken = jwt.sign(
              { email: email },
              process.env.RESET_PASSWORD_KEY!,
              {
                expiresIn: "30m",
              }
            );
            console.log(
              "🚀 ~ file: reset_password.ts:32 ~ resetPasswordToken:",
              resetPasswordToken
            );
            const info = await transporter.sendMail({
              from: '"Manga Clash" <noreply@mangaclash.com>',
              to: email,
              subject: "Reset your password",
              html: `<p>Someone has requested a password reset for the following account:</p>
              <p>Email: <a href="mailto:${email}">${email}</a></p>
              <p>If this was a mistake, just ignore this email and nothing will happen.</p>
              <p>To reset your password, visit the following address:</p>
              <a href="${process.env.NEXT_PUBLIC_HOST_URL}/reset/${resetPasswordToken}">${process.env.NEXT_PUBLIC_HOST_URL}/reset/${resetPasswordToken}</a>`,
            });
            res.status(200).json({ message: "Email Sent" });
          } else {
            res.status(200).json({ error: "Invalid Email" });
          }
        } else {
          res.status(400).json({ error: "Invalid Form" });
        }
      }
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
}
