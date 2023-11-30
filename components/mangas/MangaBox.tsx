import RowChapter from "../global/mangaBox/RowChapter"
import { MangaType } from "@/models/manga"
import ImageMangaBox from "../global/mangaBox/ImageMangaBox"
import RatingStar from "../global/mangaBox/RatingStar"
import Name from "../global/mangaBox/Name"

export default function MangaBox({ manga }: { manga: MangaType }) {
  return (
    <div className="flex flex-row col-span-2 md:col-span-1 gap-x-5">
      {/* image */}
      <ImageMangaBox manga={manga} width="w-[100px]" height="h-[144px]" />
      <div className="flex flex-col w-full gap-y-2">
        {/* name */}
        <Name manga={manga} fontSize="text-base" />
        {/* star */}
        <RatingStar manga={manga} starSize="h-3.5" fontSize="text-xs" />
        {/* 2 chapters */}
        <div className="flex flex-col mt-1 gap-y-3.5">
          {manga.chapters.map((chapter, i) => {
            return <RowChapter key={chapter.num} manga={manga} i={i} paddingChapter="px-2.5 py-1.25" fontSize="text-sm" />
          })}
        </div>
      </div>
    </div>
  )
}