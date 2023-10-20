import dbConnect from "@/lib/dbConnect";
import { NormalResponse } from "@/type";
import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/lib/auth";

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
            const email = req.body.email;
            user.email = email;
            await user.save();
            res.status(200).json({ message: "Updated Email" });
          } else {
            res.status(401).json({ error: "Invalid Token" });
          }
        } else {
          res.status(401).json({ error: "Invalid Token" });
        }
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
