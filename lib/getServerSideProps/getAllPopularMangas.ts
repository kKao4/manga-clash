import Manga from "@/models/manga";

export const getAllPopularMangas = async () => {
  const mangas = await Manga.find({}).sort({ views: -1 }).limit(10);
  // console.log("🚀 ~ file: popular_manga.ts:13 ~ mangas:", mangas);
  return mangas;
};
