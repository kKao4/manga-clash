import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import Manga from "@/models/manga";
import { MangasResponse } from "@/type";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MangasResponse>
) {
  try {
    await dbConnect();
    if (req.method === "GET") {
      const mangas: MangasResponse["data"] = await Manga.find({})
        .sort({ views: -1 })
        .limit(10);
      // console.log("🚀 ~ file: popular_manga.ts:13 ~ mangas:", mangas);
      if (mangas.length) {
        res.status(200).json({
          message: "Fetched Popular Mangas",
          data: mangas,
          length: 10,
        });
      } else {
        res.status(200).json({
          message: "No Popular Mangas",
        });
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
