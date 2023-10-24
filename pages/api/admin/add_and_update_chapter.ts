import dbConnect from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { NormalResponse } from "@/type";
import { auth } from "@/lib/auth";
import Chapter, { ChapterType } from "@/models/chapter";
import Manga from "@/models/manga";
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
          if (user && user.role === "admin") {
            const href = req.query.href;
            const form = formidable({ maxFileSize: 100 * 1024 * 1024 });
            const [fields, files] = await form.parse(req);
            console.log(
              "🚀 ~ file: add_and_update_chapter.ts:22 ~ files:",
              files
            );
            if (fields.num && fields.description && fields.arrayImages) {
              const manga = await Manga.findOne({ href: href });
              if (manga) {
                const chapter = await Chapter.findOne({ mangaId: manga._id });
                let arrayImages: {
                  name: string;
                  url: string;
                  publicId: string;
                }[] = [];
                // sort images by it's name
                fields.arrayImages.forEach((image: any) => {
                  arrayImages.push(JSON.parse(image));
                });
                arrayImages.sort(
                  (a, b) =>
                    Number(a.name.slice(0, a.name.indexOf("."))) -
                    Number(b.name.slice(0, b.name.indexOf(".")))
                );
                // console.log(
                //   "🚀 ~ file: add_and_update_chapter.ts:57 ~ arrayImages:",
                //   arrayImages
                // );
                
                if (chapter) {
                  const exist = chapter.chapters.some(
                    (c: ChapterType["chapters"][number]) =>
                      fields.num && c.num === fields.num[0]
                  );
                  if (!exist) {
                    chapter.chapters.push({
                      num: fields.num[0],
                      description: fields.description[0],
                      imagesPath: arrayImages,
                    });
                    // sort chapter desc
                    chapter.chapters.sort(
                      (
                        a: ChapterType["chapters"][number],
                        b: ChapterType["chapters"][number]
                      ) => {
                        return Number(b.num) - Number(a.num);
                      }
                    );
                    await chapter.save();
                    // set 2 latest chapters for manga collection
                    manga.chapters = chapter.chapters.slice(0, 2);
                    await manga.save();
                    res.status(200).json({ message: "Added Chapter" });
                  } else {
                    res.status(400).json({ error: "Chapter Exist" });
                  }
                } else {
                  await Chapter.create({
                    mangaId: manga._id,
                    mangaHref: manga.href,
                    chapters: [
                      {
                        num: fields.num[0],
                        description: fields.description[0],
                        imagesPath: arrayImages,
                      },
                    ],
                  });
                  // add chapter to manga
                  manga.chapters = [
                    {
                      num: fields.num[0],
                      description: fields.description[0],
                    },
                  ];
                  await manga.save();
                  res.status(200).json({
                    message: "Created Chapter Collection And Added Chapter",
                  });
                }
              } else {
                res.status(400).json({ error: "Invalid Manga" });
              }
            } else {
              res.status(400).json({ error: "Invalid Form" });
            }
          } else {
            res.status(401).json({ message: "Not Allowed" });
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
