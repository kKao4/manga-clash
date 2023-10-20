import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserResponse } from "@/type";
import { auth } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>
) {
  try {
    await dbConnect();
    const { method } = req;
    switch (method) {
      case "GET": {
        let { token } = req.query;
        // console.log("🚀 ~ file: account.ts:16 ~ token:", token)
        if (!token) {
          token = req.cookies.token;
          // console.log("🚀 ~ file: account.ts:18 ~ req.cookies.token:", req.cookies.token)
        }
        // console.log("🚀 ~ file: account.ts:18 ~ token:", token)
        const { user } = await auth(token as string);
        if (user) {
          let data = { ...user };
          data = data._doc;
          // console.log("🚀 ~ file: account.ts:20 ~ user:", user);
          delete data.password;
          // console.log("🚀 ~ file: account.ts:25 ~ data:", data);
          res.status(200).json({ message: "Verified", data: data });
        } else {
          res.status(200).json({ error: "Invalid Token" });
        }
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
