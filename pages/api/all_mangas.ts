import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import { MangasResponse, mangasPerPage } from "@/type";
import { findAndSortMangas } from "@/lib/findAndSortMangas";
import { searchName } from "@/lib/searchName";
import { searchAuthor } from "@/lib/searchAuthor";
import { searchCompleted } from "@/lib/searchCompleted";
import { searchTags } from "@/lib/searchTags";
import { sliceMangas } from "@/lib/sliceMangas";
import { MangaType } from "@/models/manga";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MangasResponse>
) {
  try {
    await dbConnect();
    if (req.method === "GET") {
      const { page, sort, name, author, completed, tags } = req.query;
      // console.log("🚀 ~ file: all_mangas.ts:14 ~ req.query:", req.query);
      let mangas: MangaType[] = [];
      let mangasLength: number = 0;
      mangas = await findAndSortMangas(sort as string);
      // console.log("🚀 ~ file: all_mangas.ts:25 ~ mangas:", mangas)

      // filter name mangas
      mangas = searchName(name as string, mangas);
      // filter author mangas
      mangas = searchAuthor(author, mangas);
      // filter status mangas
      mangas = searchCompleted(completed, mangas);
      // filter tags mangas
      mangas = searchTags(tags, mangas);
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
      if (mangas.length) {
        res.status(200).json({
          message: "Fetched Mangas",
          length: mangasLength,
          data: mangas,
        });
      } else {
        res.status(200).json({
          message: "No Mangas",
          length: 0,
        });
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
