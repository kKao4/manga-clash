import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Chapter, { ChapterType } from "@/models/chapter";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import Manga from "@/models/manga";
import { NormalResponse } from "@/type";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
          if (user && user.role === "admin") {
            const chapters: string[] = req.body.chapters;
            // console.log("🚀 ~ file: delete_chapters.ts:21 ~ chapters:", chapters)
            const href = req.query.href as string;
            const chapter = await Chapter.findOne({ mangaHref: href });
            const manga = await Manga.findOne({ href: href });
            if (chapter && manga) {
              if (chapters.length) {
                chapters.forEach(async (c) => {
                  chapter.chapters.forEach(
                    async (obj: ChapterType["chapters"][number]) => {
                      if (c === obj.num) {
                        // delete images in local storage
                        // obj.imagesPath.forEach(async (imagePath) => {
                        //   await fs.promises.unlink("./public/" + imagePath);
                        // });
                        // delete images in cloudinary
                        obj.imagesPath.forEach(async (imagePath) => {
                          const result = await cloudinary.uploader.destroy(
                            imagePath.publicId
                          );
                          console.log(
                            "🚀 ~ file: delete_chapters.ts:47 ~ obj.imagesPath.forEach ~ result:",
                            result
                          );
                        });
                        const newChapters = chapter.chapters.filter(
                          (a: any) => a.num !== c
                        );
                        chapter.chapters = newChapters;
                        // console.log(
                        //   "🚀 ~ file: delete_chapters.ts:42 ~ chapters.forEach ~ chapter.chapters:",
                        //   chapter.chapters
                        // );
                        // set 2 latest chapters for manga collection
                        manga.chapters = chapter.chapters.slice(0, 2);
                        await chapter.save();
                        await manga.save();
                      }
                    }
                  );
                });
                res.status(200).json({ message: "Deleted Chapters" });
              } else {
                res.status(400).json({ error: "Invalid Form" });
              }
            } else {
              res.status(400).json({ error: "Invalid Manga" });
            }
          } else {
            res.status(403).json({ error: "Not Allowed" });
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
