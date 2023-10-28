import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/user";
import formidable from "formidable";
import bcrypt from "bcrypt";
import { UserType } from "@/models/user";
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
    const { method } = req;
    switch (method) {
      case "POST": {
        const formData = formidable({});
        const [fields, files] = await formData.parse(req);
        let username: UserType["username"],
          email: UserType["email"],
          password: UserType["password"];
        if (fields.username && fields.password && fields.email) {
          username = fields.username[0];
          password = fields.password[0];
          email = fields.email[0];
          const user = await User.findOne({ email: email });
          if (user) {
            res.status(400).json({ message: "Email Exits" });
          } else {
            const hashPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
              username: username,
              password: hashPassword,
              email: email,
            });
            await newUser.save();
            res.status(200).json({ message: "User Created" });
          }
        } else {
          res.status(400).json({ message: "Invalid Form" });
        }
      }
    }
  } catch (error: any) {
    console.log("🚀 ~ file: sign_up.ts:45 ~ error:", error);
    res.status(500).json({ error: error.message });
  }
}
