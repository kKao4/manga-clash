import dbConnect from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import Manga from "@/models/manga";
import { toLowerCaseNonAccentVietnamese } from "@/lib/vietnamese";
import { MangaResponse } from "@/type";
import { checkFile } from "@/lib/checkExtension";
import { v2 as cloudinary } from "cloudinary";
import { Types } from "mongoose";
import { cloudinaryConfig } from "@/lib/cloudinaryConfig";
import User from "@/models/user";

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "1mb",
  },
};

cloudinaryConfig();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MangaResponse>
) {
  try {
    await dbConnect();
    const { method } = req;
    switch (method) {
      case "POST": {
        const form = formidable({ maxFileSize: 10 * 1024 * 1024 });
        const [fields, files] = await form.parse(req);
        const { _id } = req.headers;
        // console.log(
        //   "🚀 ~ file: add_manga.ts:26 ~ req.cookies.token:",
        //   req.cookies.token
        // );
        console.log("🚀 ~ file: add_manga.ts:23 ~ files:", files);
        console.log("🚀 ~ file: add_manga.ts:23 ~ fields:", fields);
        const user = await User.findById(_id);
        // console.log("🚀 ~ file: add_manga.ts:35 ~ user:", user);
        if (user && user.role === "admin") {
          if (
            fields.name &&
            fields.otherName &&
            fields.author &&
            fields.description &&
            files.image
          ) {
            // check file extension
            if (checkFile(files.image[0].originalFilename)) {
              const newHref = toLowerCaseNonAccentVietnamese(fields.name[0])
                .trim()
                .replace(/[^a-zA-Z0-9 ]/g, "")
                .replace(/\s+/g, "-");
              const newObjectId = new Types.ObjectId();
              console.log(
                "🚀 ~ file: add_manga.ts:61 ~ newObjectId:",
                newObjectId
              );
              // store image in cloudinary
              const result = await cloudinary.uploader.upload(
                files.image[0].filepath,
                {
                  public_id: newObjectId as unknown as string,
                  folder: ("mangas/" + newObjectId) as unknown as string,
                }
              );
              console.log("🚀 ~ file: add_manga.ts:68 ~ result:", result);
              const newManga = new Manga({
                _id: newObjectId,
                name: fields.name![0],
                otherName: fields.otherName![0],
                href: newHref,
                author: fields.author![0],
                image: {
                  url: result.url,
                  publicId: result.public_id,
                },
                description: fields.description![0],
                tags: fields.tags,
              });
              await newManga.save();
              res.status(200).json({ message: "Added Manga", data: newManga });
            } else {
              res.status(400).json({ error: "File Extension Is Not Matched" });
            }
          } else {
            res.status(400).json({ error: "Invalid Form" });
          }
        } else {
          res.status(403).json({ error: "Unverified" });
        }
      }
    }
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}
