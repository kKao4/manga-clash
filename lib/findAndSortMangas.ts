import { MangaType } from "@/models/manga";
import Manga from "@/models/manga";

export async function findAndSortMangas(sort: any, mangas: MangaType[]) {
  if (sort === "latest") {
    mangas = await Manga.find({}).sort({ "chapters.updatedAt": -1 });
  } else if (sort === "a-z") {
    mangas = await Manga.find({}).sort({ href: 1 });
  } else if (sort === "rating") {
    mangas = await Manga.find({}).sort({ "rating.star": -1 });
  } else if (sort === "new") {
    mangas = await Manga.find({}).sort({ createdAt: -1 });
  } else if (sort === "views") {
    mangas = await Manga.find({}).sort({ "views.value": -1 });
  }
  return mangas;
}
