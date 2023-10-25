import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import View from "@/models/view";
import Manga from "@/models/manga";
import filterViews from "@/lib/filterViews";
import { sliceMangas } from "@/lib/sliceMangas";
import { ChartResponse } from "@/type";
import { searchName } from "@/lib/searchName";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChartResponse>
) {
  try {
    await dbConnect();
    const method = req.method;
    switch (method) {
      case "GET": {
        let { token, time, pageChart, name } = req.query;
        if (!token) {
          token = req.cookies.token;
        }
        if (token) {
          const { user } = await auth(token as string);
          if (user && user.role === "admin") {
            const views = await View.find({});
            let array: any[] = [];
            const mangas = await Manga.find({});
            if (time === "all") {
              // sort views desc
              views.sort((a: any, b: any) => b.views.length - a.views.length);
              // create sorted array
              views.forEach((view: any) => {
                mangas.forEach((manga: any) => {
                  if (view.mangaId.equals(manga._id)) {
                    array.push(manga);
                  }
                });
              });
            } else if (time === "oneWeek") {
              filterViews(views, mangas, array, 7);
            } else if (time === "oneMonth") {
              filterViews(views, mangas, array, 30);
            } else if (time === "threeMonth") {
              filterViews(views, mangas, array, 90);
            }
            // filter name
            array = searchName(name, array);
            // filter manga by name
            if (name) {
              array = array.filter((a: any) => {
              return name && typeof name === "string"
                ? a.name.toLowerCase().includes(name.toLowerCase()) ||
                    a.otherName.toLowerCase().includes(name.toLowerCase())
                : false;
            });
            }
            // update rank manga
            array.forEach((a: any, i: number) => {
              a.views.rank = i + 1;
            });
            // get array length
            const arrayLength = array.length;
            // slice mangas for 1 page
            array = sliceMangas(array, Number(pageChart));
            res.status(200).json({
              message: "Ok",
              data: { mangas: array, length: arrayLength },
            });
          } else {
            res.status(401).json({ error: "Not Allowed" });
          }
        } else {
          res.status(401).json({ error: "Invalid Token" });
        }
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
