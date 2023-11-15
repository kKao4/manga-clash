import dbConnect from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import Manga from "@/models/manga";
import Rating, { RatingType } from "@/models/rating";
import User from "@/models/user";
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
        const { href } = req.query;
        const { _id } = req.headers;
        const manga = await Manga.findOne({ href: href });
        if (manga) {
          const rating = await Rating.findOne({ mangaId: manga._id });
          const user = await User.findById(_id);
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
                data: star,
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
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
