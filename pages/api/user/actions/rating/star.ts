import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { NormalResponse } from "@/type";
import { NextApiRequest, NextApiResponse } from "next";
import Manga from "@/models/manga";
import Rating, { RatingType } from "@/models/rating";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NormalResponse>
) {
  try {
    await dbConnect();
    const method = req.method;
    switch (method) {
      case "POST": {
        const { star, href } = req.body;
        // console.log("🚀 ~ file: star.ts:17 ~ href:", href)
        // console.log("🚀 ~ file: star.ts:17 ~ star:", star)
        const token = req.cookies.token;
        if (token) {
          const { user } = await auth(token);
          if (user) {
            const manga = await Manga.findOne({ href: href });
            if (manga) {
              const rating = await Rating.findOne({ mangaId: manga._id });
              if (rating) {
                // let exits = false;
                // rating.stars.forEach(async (u: RatingType["stars"][number]) => {
                //   if (u.userId.equals(user._id)) {
                //     exits = true;
                //     u.star = star;
                //   }
                // });
                // update rating if user rated
                const exits = rating.stars.some(
                  (u: RatingType["stars"][number]) => {
                    if (u.userId.equals(user._id)) {
                      u.star = star;
                      return true;
                    }
                  }
                );
                // create rating if no user rated
                if (!exits) {
                  rating.stars.push({
                    star: star,
                    userId: user._id,
                  });
                }
                // update average rating star for the manga
                const mangaRatingsLength = rating.stars.length;
                let mangaRatingsStar = 0;
                rating.stars.forEach((u: RatingType["stars"][number]) => {
                  mangaRatingsStar += u.star;
                });
                manga.rating = {
                  star: (mangaRatingsStar / mangaRatingsLength).toFixed(1),
                  length: mangaRatingsLength,
                };

                await rating.save();
                await manga.save();

                if (exits) {
                  res.status(200).json({ message: "Updated User Rating" });
                } else {
                  res.status(200).json({ message: "Added User Rating" });
                }
              } else {
                await Rating.create({
                  stars: [{ star: star, userId: user._id }],
                  mangaId: manga._id,
                  mangaHref: manga.href,
                });

                manga.rating = {
                  star: star,
                  length: 1,
                };

                await manga.save();

                res.status(200).json({
                  message: "Created User Ratings",
                });
              }
            } else {
              res.status(400).json({ error: "Invalid Manga" });
            }
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
