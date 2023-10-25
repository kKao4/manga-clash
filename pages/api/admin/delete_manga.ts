import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { NormalResponse } from "@/type";
import { NextApiRequest, NextApiResponse } from "next";
import Manga from "@/models/manga";
import Chapter, { ChapterType } from "@/models/chapter";
import Rating from "@/models/rating";
import Bookmark from "@/models/bookmark";
import View from "@/models/view";
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
      case "GET": {
        const token = req.cookies.token;
        if (token) {
          const { user } = await auth(token);
          if (user && user.role === "admin") {
            const href = req.query.href;
            console.log("🚀 ~ file: delete_manga.ts:24 ~ href:", href);
            let message = "";
            const [manga, rating, chapter, bookmark, view] = await Promise.all([
              Manga.findOneAndDelete({ href: href }),
              Rating.findOneAndDelete({ mangaHref: href }),
              Chapter.findOneAndDelete({ mangaHref: href }),
              Bookmark.findOneAndDelete({ mangaHref: href }),
              View.findOneAndDelete({ mangaHref: href }),
            ]);
            if (rating) message += ", Deleted Rating";
            if (chapter) {
              message += ", Deleted Chapter";
              chapter.chapters.forEach(
                async (c: ChapterType["chapters"][number]) => {
                  // delete images in cloudinary
                  const folder = c.imagesPath[0].publicId.slice(
                    0,
                    c.imagesPath[0].publicId.lastIndexOf("/")
                  );
                  const result =
                    await cloudinary.api.delete_resources_by_prefix(folder);
                  console.log(
                    "🚀 ~ file: delete_manga.ts:48 ~ chapter.chapters.forEach ~ result:",
                    result
                  );
                }
              );
            }
            if (bookmark) message += ", Deleted Bookmark";
            if (view) message += ", Deleted View";
            if (manga) {
              // delete image in cloudinary
              const folder = manga.image.publicId.slice(
                0,
                manga.image.publicId.lastIndexOf("/")
              );
              const result1 = await cloudinary.uploader.destroy(
                manga.image.publicId
              );
              const result2 = await cloudinary.api.delete_folder(folder);
              console.log("🚀 ~ file: delete_manga.ts:77 ~ result1:", result1);
              console.log("🚀 ~ file: delete_manga.ts:77 ~ result2:", result2);
              res.status(200).json({ message: "Deleted Manga" + message });
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
