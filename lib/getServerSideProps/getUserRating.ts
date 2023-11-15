import Manga from "@/models/manga";
import Rating, { RatingType } from "@/models/rating";
import User from "@/models/user";

export interface GetUserRating {
  _id: string;
  href: string;
}

export const getUserRating = async ({ _id, href }: GetUserRating) => {
  const user = await User.findById(_id);
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
};
