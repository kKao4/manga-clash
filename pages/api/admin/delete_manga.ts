import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { NormalResponse } from "@/type";
import { NextApiRequest, NextApiResponse } from "next";
import Manga from "@/models/manga";
import Chapter from "@/models/chapter";
import Rating from "@/models/rating";
import Bookmark from "@/models/bookmark";
import fs from "fs";

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
            if (rating) message += ", Deleted Rating";
            if (chapter) {
              message += ", Deleted Chapter";
              chapter.chapters.forEach((c: any) => {
                c.imagesPath.forEach(async (imagePath: any) => {
                  if (fs.existsSync("./public/" + imagePath)) {
                    await fs.promises.unlink("./public/" + imagePath);
                  }
                });
              });
            }
            if (bookmark) message += ", Deleted Bookmark";
            if (manga) {
              if (fs.existsSync("./public/" + manga.image)) {
                await fs.promises.unlink("./public/" + manga.image);
              }
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
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
}
