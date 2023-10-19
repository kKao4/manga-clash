import { MangaType } from "@/models/manga";

export function searchTags(
  tags: string | string[] | undefined,
  mangas: MangaType[]
) {
  if (tags) {
    mangas = mangas.filter((manga) => {
      if (Array.isArray(tags)) {
        let a = true;
        tags.forEach((tag) => {
          if (!manga.tags.includes(tag.toLowerCase())) {
            a = false;
          }
        });
        return a;
      } else {
        return manga.tags.includes(tags.toLowerCase());
      }
    });
  }
  return mangas;
}
