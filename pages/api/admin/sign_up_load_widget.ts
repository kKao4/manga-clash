import dbConnect from "@/lib/dbConnect";
import { SignatureResponse } from "@/type";
import { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";
import User from "@/models/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignatureResponse>
) {
  try {
    await dbConnect();
    const method = req.method;
    switch (method) {
      case "GET": {
        const { id, num } = req.query;
        const { _id } = req.headers;
        console.log(
          "🚀 ~ file: sign_up_load_widget.ts:18 ~ req.query:",
          req.query
        );
        const user = await User.findById(_id);
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
              apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string,
            },
          });
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
