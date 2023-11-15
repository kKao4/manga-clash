import dbConnect from "@/lib/dbConnect";
import { NormalResponse } from "@/type";
import { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/user";
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
        const { _id } = req.headers;
        const user = await User.findById(_id);
        if (user) {
          const { oldPassword, password } = req.body;
          console.log("🚀 ~ file: password.ts:21 ~ oldPassword:", oldPassword);
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
          res.status(401).json({ error: "Unverified" });
        }
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
