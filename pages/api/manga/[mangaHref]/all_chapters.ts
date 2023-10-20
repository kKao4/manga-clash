import dbConnect from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import Chapter, { ChapterType } from "@/models/chapter";
import { ChaptersResponse } from "@/type";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChaptersResponse>
) {
  try {
    await dbConnect();
    const { method } = req;
    switch (method) {
      case "GET": {
        const { mangaHref } = req.query;
        const chapter = await Chapter.findOne({ mangaHref: mangaHref });
        if (chapter) {
          let array: string[] = [];
          chapter.chapters.forEach((c: ChapterType["chapters"][number]) => {
            array.push(c.num);
          });
          res.status(200).json({
            message: "Fetched Chapters",
            data: {
              href: mangaHref as string,
              chapters: array,
            },
          });
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
