import { MangaType } from "@/models/manga";

export function searchAuthor(
  author: string | string[] | undefined,
  mangas: MangaType[]
) {
  if (author && !Array.isArray(author)) {
    mangas = mangas.filter((manga) => {
      if (manga.author) {
        return manga.author.toLowerCase() === author.toLowerCase();
      } else {
        return false;
      }
    });
  }
  return mangas;
}
