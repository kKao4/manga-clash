import Chapter, { ChapterType } from "@/models/chapter";
import Manga from "@/models/manga";

export interface GetAllChapters {
  href: string;
}

export const getAllChapters = async ({ href }: GetAllChapters) => {
  const chapter = await Chapter.findOne({ mangaHref: href });
  const manga = await Manga.findOne({ href: href });
  if (chapter) {
    let array: { num: string; description: string }[] = [];
    chapter.chapters.forEach((c: ChapterType["chapters"][number]) => {
      array.push({
        num: c.num,
        description: c.description,
      });
    });
    return {
      name: manga.name,
      href: href,
      chapters: array,
    };
  } else {
    return undefined;
  }
};
