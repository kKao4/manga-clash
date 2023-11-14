import { UserType } from "@/models/user";
import { sliceMangas } from "../sliceMangas";
import Manga, { MangaType } from "@/models/manga";

export interface GetAllMangasHistory {
  pageHistory: string;
  nameHistory: string;
  history: UserType["history"];
}

export const getAllMangasHistory = async ({
  pageHistory,
  nameHistory,
  history,
}: GetAllMangasHistory) => {
  const mangas = await Manga.find({});
  let historyMangas: any[] = [];
  history.forEach((historyManga: UserType["history"][number]) => {
    mangas.forEach((manga: MangaType) => {
      if (
        historyManga.mangaId.equals(manga._id) &&
        (manga.name.toLowerCase().includes((nameHistory as string).toLowerCase()) ||
          manga.otherName.toLowerCase().includes((nameHistory as string).toLowerCase()))
      ) {
        historyMangas.push({
          manga: manga,
          chapter: historyManga.chapter,
          createdAt: historyManga.createdAt,
        });
      }
    });
  });
  const historyMangasLength = historyMangas.length;
  historyMangas = sliceMangas(historyMangas, Number(pageHistory));
  return { historyMangasLength, historyMangas };
};
