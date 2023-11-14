import { MangaType } from "@/models/manga";

export function searchName(name: string | undefined, mangas: MangaType[]) {
  if (name) {
    mangas = mangas.filter(
      (manga) =>
        manga.name.toLowerCase().includes(name.toLowerCase()) ||
        manga.otherName.toLowerCase().includes(name.toLowerCase())
    );
  }
  return mangas;
}
