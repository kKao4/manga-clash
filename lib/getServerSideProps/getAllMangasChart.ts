import View from "@/models/view";
import Manga from "@/models/manga";
import filterViews from "../filterViews";
import { searchName } from "../searchName";
import { sliceMangas } from "../sliceMangas";

export interface GetAllMangasChart {
  time: string;
  nameChart: string;
  pageChart: string;
  num?: number;
}

export const getAllMangasChart = async ({
  time,
  nameChart,
  pageChart,
  num,
}: GetAllMangasChart) => {
  const views = await View.find({});
  let chartMangas: any[] = [];
  let trendingMangas: any[] = [];
  const mangas = await Manga.find({});
  if (time === "oneDay") {
    filterViews(views, mangas, trendingMangas, 7);
  }
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
  } else if (time === "oneDay") {
    filterViews(views, mangas, chartMangas, 1);
  }
  // filter name
  chartMangas = searchName(nameChart, chartMangas);
  // update rank manga
  chartMangas.forEach((a: any, i: number) => {
    a.views.rank = i + 1;
  });
  // get array length
  const chartMangasLength = chartMangas.length;
  // slice mangas for 1 page
  chartMangas = sliceMangas(chartMangas, Number(pageChart), num);
  return {
    chartMangas,
    chartMangasLength,
    trendingManga: trendingMangas[0] as any,
  };
};
