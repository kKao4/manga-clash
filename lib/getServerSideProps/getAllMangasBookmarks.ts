import { UserType } from "@/models/user";
import { findAndSortMangas } from "../findAndSortMangas";
import { searchName } from "../searchName";
import { sliceMangas } from "../sliceMangas";

export interface GetAllMangasBookmarks {
  pageBookmark: string;
  bookmarks: UserType["bookmarks"];
  nameBookmark?: string;
}

export const getAllMangasBookmarks = async ({
  pageBookmark,
  bookmarks,
  nameBookmark,
}: GetAllMangasBookmarks) => {
  let bookmarkMangas = await findAndSortMangas("latest");
  bookmarkMangas = bookmarkMangas.filter((manga) => {
    let a = false;
    bookmarks.forEach((bookmark: UserType["bookmarks"][number]) => {
      if (bookmark.equals(manga._id)) {
        a = true;
      }
    });
    return a;
  });
  // console.log(
  //   "🚀 ~ file: all_mangas.ts:35 ~ mangas=mangas.filter ~ mangas:",
  //   mangas
  // );
  bookmarkMangas = searchName(nameBookmark, bookmarkMangas);
  const bookmarkMangasLength = bookmarkMangas.length;
  bookmarkMangas = sliceMangas(bookmarkMangas, Number(pageBookmark));
  return { bookmarkMangas, bookmarkMangasLength };
};
