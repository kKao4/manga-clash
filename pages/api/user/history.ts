import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { searchName } from "@/lib/searchName";
import { sliceMangas } from "@/lib/sliceMangas";
import Manga, { MangaType } from "@/models/manga";
import { UserType } from "@/models/user";
import { HistoryMangasResponse, MangasResponse } from "@/type";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HistoryMangasResponse>
) {
  try {
    await dbConnect();
    const method = req.method;
    switch (method) {
      case "GET": {
        const { token, pageHistory, nameHistory } = req.query;
        if (token) {
          const { user } = await auth(token as string);
          if (user) {
            const mangas = await Manga.find({});
            let historyMangas: any[] = [];
            user.history.forEach(
              (historyManga: UserType["history"][number]) => {
                mangas.forEach((manga: MangaType) => {
                  if (
                    historyManga.mangaId.equals(manga._id) &&
                    (manga.name.includes(nameHistory as string) ||
                      manga.otherName.includes(nameHistory as string))
                  ) {
                    historyMangas.push({
                      manga: manga,
                      chapter: historyManga.chapter,
                      createdAt: historyManga.createdAt,
                    });
                  }
                });
              }
            );
            const historyMangasLength = historyMangas.length;
            historyMangas = sliceMangas(historyMangas, Number(pageHistory));
            res.status(200).json({
              message: "Fetched History Mangas",
              data: historyMangas,
              length: historyMangasLength,
            });
          } else {
            res.status(401).json({ error: "User Not Exits" });
          }
        } else {
          res.status(401).json({ error: "Not Allowed" });
        }
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}