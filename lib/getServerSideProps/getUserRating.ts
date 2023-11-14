import Manga from "@/models/manga";
import Rating, { RatingType } from "@/models/rating";
import { auth } from "../auth";

export interface GetUserRating {
  token: string | undefined;
  href: string;
}

export const getUserRating = async ({ token, href }: GetUserRating) => {
  if (token) {
    const { user } = await auth(token);
    if (user) {
      const manga = await Manga.findOne({ href: href });
      if (manga) {
        const rating = await Rating.findOne({ mangaId: manga._id });
        if (rating) {
          let star = 0;
          rating.stars.forEach((u: RatingType["stars"][number]) => {
            if (u.userId.equals(user._id)) {
              star = u.star;
            }
          });
          return star;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};
