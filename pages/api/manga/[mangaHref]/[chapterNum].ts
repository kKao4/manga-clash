import dbConnect from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import Manga from "@/models/manga";
import Chapter from "@/models/chapter";
import { ChapterType } from "@/models/chapter";
import { ChapterResponse } from "@/type";
import View from "@/models/view";
import { all } from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChapterResponse>
) {
  try {
    await dbConnect();
    const { method } = req;
    switch (method) {
      case "GET": {
        const { mangaHref, chapterNum } = req.query;
        // console.log("🚀 ~ file: [chapterNum].ts:17 ~ req.query:", req.query)
        const manga = await Manga.findOne({ href: mangaHref });
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
            res.status(200).json({
              message: "Fetched Chapter",
              data: {
                name: manga.name,
                _id: manga._id,
                href: manga.href,
                chapter: data,
              },
            });
          } else {
            res.status(400).json({ error: "Invalid Chapter" });
          }
        } else {
          res.status(400).json({ error: "Invalid Manga" });
        }
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
