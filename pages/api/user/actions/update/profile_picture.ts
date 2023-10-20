import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import User from "@/models/user";
import fs from "fs";
import { auth } from "@/lib/auth";
import { NormalResponse } from "@/type";
import { checkFile } from "@/lib/checkExtension";

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
    const method = req.method;
    switch (method) {
      case "POST": {
        const token = req.cookies.token;
        if (token) {
          const { user, _id } = await auth(token);
          if (user) {
            const form = formidable({ maxFileSize: 10 * 1024 * 1024 });
            const [fields, files] = await form.parse(req);
            if (files.profilePicture) {
              if (checkFile(files.profilePicture[0].originalFilename)) {
                const data = fs.readFileSync(files.profilePicture[0].filepath);
                fs.writeFileSync(
                  `./public/${_id}_${files.profilePicture[0].originalFilename}`,
                  data
                );
                const user = await User.findById(_id);
                user.profilePicture = `${_id}_${files.profilePicture[0].originalFilename}`;
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
