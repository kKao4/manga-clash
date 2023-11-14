import Manga from "@/models/manga";
import Chapter from "@/models/chapter";

export interface GetManga {
  href: string;
}

export const getManga = async ({ href }: GetManga) => {
  const manga = await Manga.findOne({
    href: href,
  });
  if (manga) {
    const chapter = await Chapter.findOne({ mangaId: manga._id });
    if (chapter) {
      manga.chapters = chapter.chapters;
    } else {
      manga.chapters = [];
    }
    // console.log("🚀 ~ file: [mangaHref].ts:23 ~ chapter.chapters:", chapter.chapters)
    // console.log("🚀 ~ file: [mangaHref].ts:23 ~ manga:", manga);
  }
  return manga;
};
