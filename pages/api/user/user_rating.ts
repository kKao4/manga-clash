import dbConnect from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import Manga from "@/models/manga";
import Rating, { RatingType } from "@/models/rating";
import { auth } from "@/lib/auth";
import { UserRatingResponse } from "@/type";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserRatingResponse>
) {
  try {
    await dbConnect();
    const { method } = req;
    switch (method) {
      case "GET": {
        let token = "";
        token = (req.query.token as string) ?? req.cookies.token;
        const { href } = req.query;
        if (token) {
          const manga = await Manga.findOne({ href: href });
          if (manga) {
            const rating = await Rating.findOne({ mangaId: manga._id });
            const { user } = await auth(token as string);
            if (user) {
              if (rating) {
                let star = 0;
                rating.stars.forEach((u: RatingType["stars"][number]) => {
                  if (u.userId.equals(user._id)) {
                    star = u.star;
                  }
                });
                res.status(200).json({
                  message: "Fetched User Rating",
                  data: { star: star },
                });
              } else {
                res
                  .status(200)
                  .json({ message: "User Rating Collections Not Exits" });
              }
            } else {
              res.status(403).json({ error: "Unverified" });
            }
          } else {
            res.status(400).json({ error: "Invalid Manga" });
          }
        } else {
          res.status(401).json({ error: "Invalid Token" });
        }
      }
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
}
