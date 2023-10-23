import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { NormalResponse } from "@/type";
import { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();
    const method = req.method;
    switch (method) {
      case "GET": {
        const token = req.cookies.token;
        const { id, num } = req.query;
        // console.log("🚀 ~ file: sign_up_load_widget.ts:18 ~ req.query:", req.query)
        if (token) {
          const { user } = await auth(token as string);
          if (user && user.role === "admin") {
            const timestamp = Math.round(new Date().getTime() / 1000);
            const signature = cloudinary.utils.api_sign_request(
              {
                timestamp: timestamp,
                source: "uw",
                folder: `mangas/${id}/chapter-${num}`,
              },
              process.env.CLOUDINARY_API_SECRET as string
            );
            res.status(200).json({
              message: "Generated Signature",
              data: {
                timestamp: timestamp,
                signature: signature,
                apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
              },
            });
          } else {
            res.status(401).json({ error: "Not Allowed" });
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
