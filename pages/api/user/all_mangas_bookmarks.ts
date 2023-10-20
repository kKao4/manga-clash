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
      let { page, sort, token, name } = req.query;
      if (!token) {
        token = req.cookies.token;
      }
      const { user } = await auth(token as string);
      if (user) {
        let mangas: any[] = [];
        mangas = await findAndSortMangas(sort, mangas);
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
        mangas = searchName(name, mangas);
        const mangasLength = mangas.length;
        mangas = sliceMangas(mangas, Number(page));
        res.status(200).json({
          message: "Fetched Bookmark Mangas",
          data: mangas,
          length: mangasLength,
        });
      } else {
        res
          .status(401)
          .json({ message: "Invalid Token", data: null, length: 0 });
      }
    }
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ message: err.message, data: null, length: 0 });
  }
}
