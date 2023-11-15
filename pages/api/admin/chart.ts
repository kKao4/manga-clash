import dbConnect from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import View from "@/models/view";
import Manga, { MangaType } from "@/models/manga";
import filterViews from "@/lib/filterViews";
import { sliceMangas } from "@/lib/sliceMangas";
import { ChartResponse } from "@/type";
import { searchName } from "@/lib/searchName";
import User from "@/models/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChartResponse>
) {
  try {
    await dbConnect();
    const method = req.method;
    switch (method) {
      case "GET": {
        let { time, pageChart, nameChart } = req.query;
        const { _id } = req.headers;
        const user = await User.findById(_id);
        if (user && user.role === "admin") {
          const views = await View.find({});
          let chartMangas: MangaType[] = [];
          const mangas = await Manga.find({});
          if (time === "all") {
            // sort views desc
            views.sort((a: any, b: any) => b.views.length - a.views.length);
            // create sorted array
            views.forEach((view: any) => {
              mangas.forEach((manga: any) => {
                if (view.mangaId.equals(manga._id)) {
                  chartMangas.push(manga);
                }
              });
            });
          } else if (time === "oneWeek") {
            filterViews(views, mangas, chartMangas, 7);
          } else if (time === "oneMonth") {
            filterViews(views, mangas, chartMangas, 30);
          } else if (time === "threeMonth") {
            filterViews(views, mangas, chartMangas, 90);
          }
          // filter name
          chartMangas = searchName(nameChart as string, chartMangas);
          // update rank manga
          chartMangas.forEach((a: any, i: number) => {
            a.views.rank = i + 1;
          });
          // get array length
          const chartMangasLength = chartMangas.length;
          // slice mangas for 1 page
          chartMangas = sliceMangas(chartMangas, Number(pageChart));
          res.status(200).json({
            message: "Ok",
            data: chartMangas,
            length: chartMangasLength,
          });
        } else {
          res.status(401).json({ error: "Unverified" });
        }
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
