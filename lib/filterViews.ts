import { MangaType } from "@/models/manga";
import { ViewType } from "@/models/view";
import { formatDistanceToNowStrict, parseISO } from "date-fns";

export default function filterViews(
  views: ViewType[],
  mangas: MangaType[],
  array: any[],
  day: number
) {
  const newViews = views.map((view: ViewType) => {
    // update view.views
    view.views = view.views.filter((v: ViewType["views"][number]) => {
      // ANCHOR: only take below given days, must use toISOString() to convert NativeDate to Date
      return (
        Number(
          formatDistanceToNowStrict(parseISO(v.createdAt.toISOString()), {
            unit: "day",
          }).split(" ")[0]
        ) <= day
      );
    }) as any;
    return view;
  });
  // sort views desc
  newViews.sort((a: any, b: any) => b.views.length - a.views.length);
  newViews.forEach((view: any, i: number) => {
    mangas.forEach((manga: any) => {
      if (view.mangaId.equals(manga._id)) {
        // set manga views equal to view.views length
        manga.views.value = view.views.length;
        array.push(manga);
      }
    });
  });
}
