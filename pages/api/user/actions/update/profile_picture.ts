import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { auth } from "@/lib/auth";
import { NormalResponse } from "@/type";
import { checkFile } from "@/lib/checkExtension";
import { v2 as cloudinary } from "cloudinary";
import { cloudinaryConfig } from "@/lib/cloudinaryConfig";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinaryConfig();

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
            const form = formidable({ maxFileSize: 10 * 1024 * 1024 });
            const [fields, files] = await form.parse(req);
            // console.log("🚀 ~ file: profile_picture.ts:33 ~ files:", files)
            if (files.profilePicture) {
              if (checkFile(files.profilePicture[0].originalFilename)) {
                // store image in cloudinary
                const result = await cloudinary.uploader.upload(
                  files.profilePicture[0].filepath,
                  { public_id: user._id, folder: "user-profile-pictures" }
                );
                console.log(
                  "🚀 ~ file: profile_picture.ts:54 ~ result:",
                  result
                );
                user.profilePicture = {
                  url: result.url,
                  publicId: result.public_id,
                };
                await user.save();
                res.status(200).json({ message: "Uploaded Profile Picture" });
              } else {
                res
                  .status(400)
                  .json({ error: "File Extension Is Not Matched" });
              }
            } else {
              res.status(400).json({ error: "No File Uploaded" });
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
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
