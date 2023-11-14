import { MangaType } from "@/models/manga";
import { sliceMangas } from "../sliceMangas";
import { findAndSortMangas } from "../findAndSortMangas";
import { searchName } from "../searchName";

export interface GetALlMangas {
  page: string;
  sort: string;
  name?: string;
  author?: string;
  completed?: string;
  tags?: string | string[];
}

export const getAllMangas = async ({
  page,
  sort,
  name,
  author,
  completed,
  tags,
}: GetALlMangas) => {
  // find all mangas and sort
  let mangas = await findAndSortMangas(sort as string);
  // filter name
  mangas = searchName(name, mangas);
  // filter author
  if (author) {
    mangas = mangas.filter((manga) => {
      if (manga.author) {
        return manga.author.toLowerCase() === author.toLowerCase();
      } else {
        return false;
      }
    });
  }
  // filter status
  if (completed) {
    mangas = mangas.filter((manga) => {
      return manga.completed === (completed === "true");
    });
  }
  // filter tags
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
  // get length
  const mangasLength = mangas.length;
  // slice mangas per page
  mangas = sliceMangas(mangas, Number(page));
  // sort latest chapters
  mangas.forEach((manga: MangaType) => {
    manga.chapters.sort(
      (a: { num: any }, b: { num: any }) => Number(b.num) - Number(a.num)
    );
  });
  return { mangas, mangasLength };
};
