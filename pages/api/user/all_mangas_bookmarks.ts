import dbConnect from "@/lib/dbConnect";
import Manga from "@/models/manga";
import { MangasResponse, mangasPerPage } from "@/type";
import type { NextApiRequest, NextApiResponse } from "next";
import User, { UserType } from "@/models/user";
import { auth } from "@/lib/auth";
import { sliceMangas } from "@/lib/sliceMangas";
import { findAndSortMangas } from "@/lib/findAndSortMangas";
import { searchName } from "@/lib/searchName";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MangasResponse>
) {
  try {
    await dbConnect();
    if (req.method === "GET") {
      let { pageBookmark, sort, token, nameBookmark } = req.query;
      // console.log("🚀 ~ file: all_mangas_bookmarks.ts:19 ~ req.query:", req.query)
      if (!token) {
        token = req.cookies.token;
      }
      const { user } = await auth(token as string);
      if (user) {
        let mangas = await findAndSortMangas(sort as string);
        mangas = mangas.filter((manga) => {
          let a = false;
          user.bookmarks.forEach((bookmark: UserType["bookmarks"][number]) => {
            if (bookmark.equals(manga._id)) {
              a = true;
            }
          });
          return a;
        });
        // console.log(
        //   "🚀 ~ file: all_mangas.ts:35 ~ mangas=mangas.filter ~ mangas:",
        //   mangas
        // );
        mangas = searchName(nameBookmark as string, mangas);
        const mangasLength = mangas.length;
        mangas = sliceMangas(mangas, Number(pageBookmark));
        res.status(200).json({
          message: "Fetched Bookmark Mangas",
          data: mangas,
          length: mangasLength,
        });
      } else {
        res.status(401).json({ error: "Invalid Token" });
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
