import dbConnect from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import Manga from "@/models/manga";
import { toLowerCaseNonAccentVietnamese } from "@/lib/vietnamese";
import { UpdateMangaResponse } from "@/type";
import { checkFile } from "@/lib/checkExtension";
import Rating from "@/models/rating";
import Chapter from "@/models/chapter";
import Bookmark from "@/models/bookmark";
import { v2 as cloudinary } from "cloudinary";
import { cloudinaryConfig } from "@/lib/cloudinaryConfig";
import User from "@/models/user";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinaryConfig();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateMangaResponse>
) {
  try {
    await dbConnect();
    const method = req.method;
    switch (method) {
      case "POST": {
        const { _id } = req.headers;
        const user = await User.findById(_id);
        if (user && user.role === "admin") {
          const form = formidable({ maxFileSize: 10 * 1024 * 1024 });
          const [fields, files] = await form.parse(req);
          // console.log("🚀 ~ file: update_manga.ts:22 ~ files:", files);
          console.log("🚀 ~ file: update_manga.ts:22 ~ fields:", fields);
          if (
            fields._id &&
            fields.name &&
            fields.otherName &&
            fields.author &&
            fields.completed &&
            fields.description
          ) {
            const _id = fields._id[0];
            const [manga, rating, chapter, bookmark] = await Promise.all([
              Manga.findById(_id),
              Rating.findOne({ mangaId: _id }),
              Chapter.findOne({ mangaId: _id }),
              Bookmark.findOne({ mangaId: _id }),
            ]);
            if (manga) {
              const newHref = toLowerCaseNonAccentVietnamese(fields.name[0])
                .trim()
                .replace(/[^a-zA-Z0-9 ]/g, "")
                .replace(/\s+/g, "-");
              manga.name = fields.name[0];
              manga.otherName = fields.otherName[0];
              manga.author = fields.author[0];
              manga.completed = fields.completed[0] === "true" ? true : false;
              if (fields.tags) {
                manga.tags = fields.tags;
              } else {
                manga.tags = [];
              }
              manga.description = fields.description[0];
              manga.href = newHref;
              // change other href collections
              if (rating) {
                rating.mangaHref = newHref;
                await rating.save();
              }
              if (chapter) {
                chapter.mangaHref = newHref;
                await chapter.save();
              }
              if (bookmark) {
                bookmark.mangaHref = newHref;
                await bookmark.save();
              }
              // save image
              if (files.image) {
                if (checkFile(files.image[0].originalFilename)) {
                  // store image in cloudinary
                  const result = await cloudinary.uploader.upload(
                    files.image[0].filepath,
                    { public_id: manga._id, folder: "/mangas/" + manga._id }
                  );
                  console.log(
                    "🚀 ~ file: update_manga.ts:101 ~ result:",
                    result
                  );
                  manga.image = {
                    url: result.url,
                    publicId: result.public_id,
                  };
                } else {
                  res
                    .status(400)
                    .json({ error: "File Extension Is Not Matched" });
                }
              }
              await manga.save();
              res.status(200).json({
                message: "Updated Manga",
                data: { href: manga.href },
              });
            } else {
              res.status(400).json({ error: "Invalid Manga" });
            }
          } else {
            res.status(400).json({ error: "Invalid Form" });
          }
        } else {
          res.status(403).json({ error: "Unverified" });
        }
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
