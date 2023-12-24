import { MangaType } from "@/models/manga"
import RowChapter from "@/components/global/mangaBox/RowChapter"
import ImageMangaBox from "@/components/global/mangaBox/ImageMangaBox"
import Name from "@/components/global/mangaBox/Name"

export default function MangaBoxPopular({ manga }: { manga: MangaType }) {
  return (
    <div className="flex flex-row col-span-1 gap-x-5">
      {/* image */}
      <ImageMangaBox manga={manga} width="w-[64px]" height="h-[86px]" />
      <div className="flex flex-col w-full gap-y-1.5">
        {/* name */}
        <Name manga={manga} fontSize="text-2sm" />
        {/* 2 chapters */}
        {manga.chapters.map((chapter, i) => {
          return <RowChapter key={i} manga={manga} i={i} paddingChapter="px-2 py-1" fontSize="text-2sm" />
        })}
      </div>
    </div>
  )
}