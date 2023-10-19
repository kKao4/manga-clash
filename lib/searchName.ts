import { MangaType } from "@/models/manga";

export function searchName(
  name: string | string[] | undefined,
  mangas: MangaType[]
) {
  if (name && !Array.isArray(name)) {
    mangas = mangas.filter(
      (manga) =>
        manga.name.toLowerCase().includes(name.toLowerCase()) ||
        manga.otherName.toLowerCase().includes(name.toLowerCase())
    );
  }
  return mangas;
}
