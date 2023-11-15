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
import User, { UserType } from "@/models/user";

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
        const { _id } = req.headers;
        const user = await User.findById(_id);
        if (user && user.role === "admin") {
          const href = req.query.href;
          let message = "";
          const [manga, rating, chapter, bookmark, view, users] =
            await Promise.all([
              Manga.findOneAndDelete({ href: href }),
              Rating.findOneAndDelete({ mangaHref: href }),
              Chapter.findOneAndDelete({ mangaHref: href }),
              Bookmark.findOneAndDelete({ mangaHref: href }),
              View.findOneAndDelete({ mangaHref: href }),
              User.find({}),
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
                const result = await cloudinary.api.delete_resources_by_prefix(
                  folder
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
            // delete bookmark manga from all users
            users.forEach(async (user: UserType) => {
              let exist = false;
              user.bookmarks = user.bookmarks.filter((bookmark) => {
                exist = true;
                return !bookmark.equals(manga._id);
              });
              if (exist) {
                await (user as any).save()
              }
            });
            const result2 = await cloudinary.api.delete_folder(folder);
            res.status(200).json({ message: "Deleted Manga" + message });
          } else {
            res.status(400).json({ error: "Invalid Manga" });
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
