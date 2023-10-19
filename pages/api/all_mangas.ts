import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import Manga from "@/models/manga";
import User, { UserType } from "@/models/user";
import { MangasResponse, mangasPerPage } from "@/type";
import { findAndSortMangas } from "@/lib/findAndSortMangas";
import { searchName } from "@/lib/searchName";
import { searchAuthor } from "@/lib/searchAuthor";
import { searchCompleted } from "@/lib/searchCompleted";
import { searchTags } from "@/lib/searchTags";
import { sliceMangas } from "@/lib/sliceMangas";
import { MangaType } from "@/models/manga";
import Chapter from "@/models/chapter";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MangasResponse>
) {
  try {
    await dbConnect();
    if (req.method === "GET") {
      const { page, sort, name, author, year, completed, tags } = req.query;
      // console.log("🚀 ~ file: all_mangas.ts:14 ~ req.query:", req.query);
      let mangas: MangaType[] = [];
      let mangasLength: number = 0;
      mangas = await findAndSortMangas(sort, mangas);
      // console.log("🚀 ~ file: all_mangas.ts:25 ~ mangas:", mangas)

      // filter name mangas
      mangas = searchName(name, mangas);
      // filter author mangas
      mangas = searchAuthor(author, mangas);
      // filter status mangas
      mangas = searchCompleted(completed, mangas);
      // filter tags mangas
      mangas = searchTags(tags, mangas);
      // if (year) {
      //   mangas = mangas.filter((manga) => manga.year === year)
      // }
      // get length of the mangas
      mangasLength = mangas.length;
      // slice mangas per page
      mangas = sliceMangas(mangas, Number(page));
      // sort latest chapters
      mangas.forEach((manga: MangaType) => {
        manga.chapters.sort(
          (a: { num: any }, b: { num: any }) => Number(b.num) - Number(a.num)
        );
      });
      // take 2 latest chapters
      // mangas.forEach((manga: MangaType) => {
      //   manga.chapters = manga.chapters.slice(0, 2);
      // });
      // console.log(
      //   "🚀 ~ file: all_mangas.ts:38 ~ mangas.forEach ~ mangas:",
      //   mangas
      // );
      // console.log(
      //   "🚀 ~ file: all_mangas.ts:44 ~ sortManga:",
      //   sortMangas[0].chapters
      // );
      // console.log("🚀 ~ file: all_mangas.ts:41 ~ mangas:", mangas[0].chapters);
      if (mangas.length) {
        res.status(200).json({
          message: "Fetched Mangas",
          length: mangasLength,
          data: mangas,
          search: name,
        });
      } else {
        res.status(200).json({
          message: "No Mangas",
          length: 0,
          data: null,
          search: name,
        });
      }
    }
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json(err);
  }
}
