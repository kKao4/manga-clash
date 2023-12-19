import { mangasPerPage } from "@/type";
import { MangaType } from "@/models/manga";

export function sliceMangas(mangas: MangaType[], page: number, i?: number) {
  let num = mangasPerPage;
  if (i) {
    num = i;
  }
  return mangas.slice(0 + num * (page - 1), num + num * (page - 1));
}
