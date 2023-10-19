import { MangaType } from "@/models/manga";

export function searchCompleted(
  completed: string | string[] | undefined,
  mangas: MangaType[]
) {
  if (completed) {
    mangas = mangas.filter((manga) => {
      return manga.completed === (completed === "true");
    });
  }
  return mangas;
}
