import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { NormalResponse } from "@/type";
import { NextApiRequest, NextApiResponse } from "next";
import Manga from "@/models/manga";
import Chapter from "@/models/chapter";
import Rating from "@/models/rating";
import Bookmark from "@/models/bookmark";
import View from "@/models/view";
import fs from "fs";
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
      case "GET": {
        const token = req.cookies.token;
        if (token) {
          const { user } = await auth(token);
          if (user && user.role === "admin") {
            const href = req.query.href;
            console.log("🚀 ~ file: delete_manga.ts:24 ~ href:", href);
            let message = "";
            const manga = await Manga.findOneAndDelete({ href: href });
            const rating = await Rating.findOneAndDelete({ mangaHref: href });
            const chapter = await Chapter.findOneAndDelete({ mangaHref: href });
            const bookmark = await Bookmark.findOneAndDelete({
              mangaHref: href,
            });
            const view = await View.findOneAndDelete({ mangaHref: href });
            if (rating) message += ", Deleted Rating";
            if (chapter) {
              message += ", Deleted Chapter";
              chapter.chapters.forEach((c: any) => {
                // delete images in local storage
                // c.imagesPath.forEach(async (imagePath: any) => {
                //   if (fs.existsSync("./public/" + imagePath)) {
                //     await fs.promises.unlink("./public/" + imagePath);
                //   }
                // });

                // delete images in cloudinary
                c.imagesPath.forEach(async (imagePath: any) => {
                  const result = await cloudinary.uploader.destroy(
                    imagePath.publicId
                  );
                  console.log(
                    "🚀 ~ file: delete_manga.ts:56 ~ c.imagesPath.forEach ~ result:",
                    result
                  );
                });
              });
            }
            if (bookmark) message += ", Deleted Bookmark";
            if (view) message += ", Deleted View";
            if (manga) {
              // delete image in local storage
              // if (fs.existsSync("./public/" + manga.image)) {
              //   await fs.promises.unlink("./public/" + manga.image);
              // }

              // delete image in cloudinary
              const result = await cloudinary.uploader.destroy(
                manga.image.publicId
              );
              console.log("🚀 ~ file: delete_manga.ts:77 ~ result:", result);
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
