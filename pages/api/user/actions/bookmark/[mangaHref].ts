import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import User, { UserType } from "@/models/user";
import Manga from "@/models/manga";
import { NormalResponse } from "@/type";
import { auth } from "@/lib/auth";
import Bookmark, { BookmarkType } from "@/models/bookmark";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NormalResponse>
) {
  try {
    await dbConnect();
    const { method } = req;
    switch (method) {
      case "GET": {
        const { mangaHref } = req.query;
        const token = req.cookies.token;
        if (token) {
          const { user } = await auth(token);
          if (user) {
            // console.log(
            //   "🚀 ~ file: [mangaHref].ts:21 ~ req.query.mangaHref:",
            //   req.query.mangaHref
            // );
            const manga = await Manga.findOne({
              href: mangaHref,
            });
            if (manga) {
              const bookmark = await Bookmark.findOne({ mangaId: manga._id });
              if (bookmark) {
                if (bookmark.bookmarks.includes(user._id)) {
                  bookmark.bookmarks = bookmark.bookmarks.filter(
                    (userId: BookmarkType["bookmarks"][number]) => {
                      return !userId.equals(user._id);
                    }
                  );
                  manga.bookmarks -= 1;
                } else {
                  bookmark.bookmarks.push(user._id);
                  manga.bookmarks += 1;
                }
                await bookmark.save();
              } else {
                await Bookmark.create({
                  mangaId: manga._id,
                  mangaHref: manga.href,
                  bookmarks: [user._id],
                });
                manga.bookmarks = 1;
              }
              await manga.save();
              if (!user.bookmarks.includes(manga._id)) {
                user.bookmarks.push(manga._id);
                await user.save();
                res.status(200).json({ message: "Add Bookmark" });
              } else {
                user.bookmarks = user.bookmarks.filter(
                  (mangaId: UserType["bookmarks"][number]) => {
                    return !mangaId.equals(manga._id);
                  }
                );
                await user.save();
                res.status(200).json({ message: "Delete Bookmark" });
              }
            } else {
              res.status(400).json({ error: "Invalid Manga" });
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
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
}
