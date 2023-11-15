import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserResponse } from "@/type";
import User from "@/models/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>
) {
  try {
    await dbConnect();
    const { method } = req;
    switch (method) {
      case "GET": {
        const { _id } = req.headers;
        const user = await User.findById(_id);
        if (user) {
          let data = { ...user };
          data = data._doc;
          // console.log("🚀 ~ file: account.ts:20 ~ user:", user);
          delete data.password;
          // console.log("🚀 ~ file: account.ts:25 ~ data:", data);
          res.status(200).json({ message: "Verified", data: data });
        } else {
          res.status(200).json({ error: "Unverified" });
        }
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
