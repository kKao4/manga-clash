import Manga from "@/models/manga";
import Chapter, { ChapterType } from "@/models/chapter";
import View from "@/models/view";
import { auth } from "../auth";
import { UserType } from "@/models/user";

export interface GetChapter {
  href: string;
  chapterNum: string;
  token: string;
}

export const getChapter = async ({ href, chapterNum, token }: GetChapter) => {
  const manga = await Manga.findOne({ href: href });
  if (manga) {
    const chapter = await Chapter.findOne({ mangaId: manga._id });
    // console.log("🚀 ~ file: [chapterNum].ts:24 ~ chapter:", chapter)
    const view = await View.findOne({ mangaId: manga._id });
    // console.log("🚀 ~ file: [chapterNum].ts:25 ~ view:", view)
    if (chapter && chapterNum && !Array.isArray(chapterNum)) {
      const num = chapterNum.split("-")[1];
      // console.log("🚀 ~ file: [chapterNum].ts:22 ~ chapter:", chapter);
      // find the data for the chapter
      const data = chapter.chapters.find(
        (c: ChapterType["chapters"][number]) => c.num === num
      );
      // console.log("🚀 ~ file: [chapterNum].ts:26 ~ data:", data);
      if (data) {
        // update or create view collection
        if (view) {
          view.views.push({
            num: num,
          });
          await view.save();
        } else {
          await View.create({
            mangaId: manga._id,
            mangaHref: manga.href,
            views: [
              {
                num: num,
              },
            ],
          });
        }
        const allViews = await View.find({});
        // sort all view documents des
        allViews.sort((a: any, b: any) => b.views.length - a.views.length);
        // update rank for manga
        allViews.forEach((v: any, i: number) => {
          if (v.mangaId.equals(manga._id)) {
            manga.views.rank = i + 1;
          }
        });
        // update views for manga
        manga.views.value = view.views.length;
        await manga.save();
        // update user history
        if (token) {
          const { user } = await auth(token);
          if (user) {
            user.history = user.history.filter(
              (obj: UserType["history"][number]) =>
                !obj.mangaId.equals(manga._id)
            );
            user.history.unshift({
              mangaId: manga._id,
              chapter: num,
            });
            await user.save();
          }
        }
        return {
          name: manga.name,
          _id: manga._id,
          href: manga.href,
          chapter: data,
        };
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
};
