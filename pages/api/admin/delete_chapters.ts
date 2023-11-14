import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Chapter, { ChapterType } from "@/models/chapter";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import Manga from "@/models/manga";
import { NormalResponse } from "@/type";
import { v2 as cloudinary } from "cloudinary";
import { cloudinaryConfig } from "@/lib/cloudinaryConfig";

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
          if (user && user.role === "admin") {
            const chapters: string[] = req.body.chapters;
            // console.log("🚀 ~ file: delete_chapters.ts:21 ~ chapters:", chapters)
            const href = req.query.href as string;
            const [chapter, manga] = await Promise.all([
              Chapter.findOne({ mangaHref: href }),
              Manga.findOne({ href: href }),
            ]);
            if (chapter && manga) {
              if (chapters.length) {
                chapters.forEach(async (c) => {
                  chapter.chapters.forEach(
                    async (obj: ChapterType["chapters"][number]) => {
                      // delete images in cloudinary
                      if (obj.num === c) {
                        const folder = obj.imagesPath[0].publicId.slice(
                          0,
                          obj.imagesPath[0].publicId.lastIndexOf("/")
                        );
                        const result1 =
                          await cloudinary.api.delete_resources_by_prefix(
                            folder
                          );
                        // console.log(
                        //   "🚀 ~ file: delete_chapters.ts:48 ~ obj.imagesPath.forEach ~ result:",
                        //   result1
                        // );
                        const result2 = await cloudinary.api.delete_folder(
                          folder
                        );
                        // console.log(
                        //   "🚀 ~ file: delete_chapters.ts:55 ~ result2:",
                        //   result2
                        // );
                      }
                    }
                  );
                  const newChapters = chapter.chapters.filter(
                    (a: any) => a.num !== c
                  );
                  chapter.chapters = newChapters;
                  // console.log(
                  //   "🚀 ~ file: delete_chapters.ts:42 ~ chapters.forEach ~ chapter.chapters:",
                  //   chapter.chapters
                  // );
                });
                // set 2 latest chapters for manga collection
                manga.chapters = chapter.chapters.slice(0, 2);
                // console.log("🚀 ~ file: delete_chapters.ts:64 ~ manga:", manga);
                await Promise.all([chapter.save(), manga.save()]);
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
