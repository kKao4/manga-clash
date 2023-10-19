import { mangasPerPage } from "@/type";
import { MangaType } from "@/models/manga";

export function sliceMangas(mangas: MangaType[], page: number) {
  return mangas.slice(
    0 + mangasPerPage * (page - 1),
    mangasPerPage + mangasPerPage * (page - 1)
  );
}
