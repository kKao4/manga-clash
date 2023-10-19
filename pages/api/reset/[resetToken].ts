import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import User, { UserType } from "@/models/user";
import bcrypt from "bcrypt";
import formidable from "formidable";
import { NormalResponse } from "@/type";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NormalResponse>
) {
  try {
    await dbConnect();
    const method = req.method;
    switch (method) {
      case "POST": {
        const resetToken: string = req.query.resetToken as string;
        const form = formidable({});
        const [fields, files] = await form.parse(req);
        if (fields.password) {
          const newPassword = fields.password[0];
          const decoded: any = jwt.verify(
            resetToken,
            process.env.RESET_PASSWORD_KEY!
          );
          const user = await User.findOne({
            email: decoded.email,
          });
          if (user) {
            // console.log("🚀 ~ file: new_password.ts:24 ~ user:", user);
            const newHashPassword = await bcrypt.hash(newPassword, 10);
            user.password = newHashPassword;
            // console.log("🚀 ~ file: new_password.ts:26 ~ user:", user);
            await user.save();
            res.status(200).json({ message: "Changed Password" });
          } else {
            res.status(403).json({ error: "Invalid Token" });
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
