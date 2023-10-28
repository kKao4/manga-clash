import dbConnect from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import Manga from "@/models/manga";
import { searchName } from "@/lib/searchName";
import { MangasResponse } from "@/type";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MangasResponse>
) {
  try {
    await dbConnect();
    const method = req.method;
    switch (method) {
      case "GET": {
        const { name } = req.query;
        // console.log("🚀 ~ file: all_mangas_dropdown.ts:17 ~ name:", name)
        let mangas = await Manga.find({});
        mangas = searchName(name, mangas);
        // console.log("🚀 ~ file: all_mangas_dropdown.ts:20 ~ mangas:", mangas)
        mangas = mangas.slice(0, 12);
        res
          .status(200)
          .json({ message: "Fetched Searched Mangas", data: mangas });
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
