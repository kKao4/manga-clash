import dbConnect from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import Manga from "@/models/manga";
import Chapter from "@/models/chapter";
import { MangaResponse } from "@/type";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MangaResponse>
) {
  try {
    await dbConnect();
    const { method } = req;
    switch (method) {
      case "GET": {
        const { mangaHref } = req.query;
        const manga = await Manga.findOne({
          href: mangaHref,
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
        res.status(200).json({ message: "Fetched Manga", data: manga });
      }
    }
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}
