import dbConnect from "@/lib/dbConnect";
import { NormalResponse } from "@/type";
import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/lib/auth";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NormalResponse>
) {
  try {
    await dbConnect();
    const method = req.method;
    switch (method) {
      case "POST": {
        const token = req.cookies.token;
        if (token) {
          const { user } = await auth(token);
          if (user) {
            const { oldPassword, password } = req.body;
            console.log(
              "🚀 ~ file: password.ts:21 ~ oldPassword:",
              oldPassword
            );
            console.log("🚀 ~ file: password.ts:21 ~ password:", password);
            const match = await bcrypt.compare(oldPassword, user.password);
            console.log("🚀 ~ file: password.ts:23 ~ match:", match);
            if (match) {
              const hashPassword = await bcrypt.hash(password, 10);
              user.password = hashPassword;
              await user.save();
              res.status(200).json({ message: "Updated Password" });
            } else {
              res.status(401).json({ error: "Unverified" });
            }
          } else {
            res.status(401).json({ error: "Invalid Token" });
          }
        } else {
          res.status(401).json({ error: "Invalid Token" });
        }
      }
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
}
