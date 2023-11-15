import dbConnect from "@/lib/dbConnect";
import { NormalResponse } from "@/type";
import { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/user";

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
        const _id = req.headers._id;
        // console.log("🚀 ~ file: username.ts:17 ~ _id:", _id);
        if (token) {
          const user = await User.findById(_id);
          if (user) {
            const username = req.body.username;
            user.username = username;
            await user.save();
            res.status(200).json({ message: "Updated Username" });
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
