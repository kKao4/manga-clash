import { MangaType } from "@/models/manga"
import { formatDistanceToNowStrict, parseISO } from "date-fns"
import TagsDetailManga from "../mangaHref/TagsDetailManga"
import Link from "next/link"
import { vi } from "date-fns/locale"
import RatingStar from "../global/mangaBox/RatingStar"
import ImageMangaBox from "../global/mangaBox/ImageMangaBox"
import Name from "../global/mangaBox/Name"

export default function MangaBox({ manga }: { manga: MangaType }) {
  return (
    <>
      <div className="flex flex-row col-span-2 gap-x-4 md:gap-x-8">
        {/* image */}
        <ImageMangaBox manga={manga} width="w-[95px] md:w-[160px]" height="h-[136px] md:h-[230px]" />
        <div className="flex flex-col gap-y-1.5 flex-1">
          {/* name */}
         <Name manga={manga} fontSize="text-lg" />
          <div className="px-5 py-2.5 text-sm md:py-3 bg-neutral-100 dark:bg-neutral-750 md:text-base">
            <div className="flex flex-col gap-y-2 md:gap-y-3">
              <div className="flex flex-col md:flex-row">
                <p className="flex-1 font-bold text-gray-200 basis-1/6 dark:text-neutral-400">Tên khác</p>
                <p className="flex-1 basis-5/6">{manga.otherName ? manga.otherName : "Đang cập nhật"}</p>
              </div>
              <div className="flex flex-col md:flex-row">
                <p className="flex-1 font-bold text-gray-200 basis-1/6 dark:text-neutral-400">Thể loại</p>
                <div className="flex-1 basis-5/6">
                  <TagsDetailManga manga={manga} />
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <p className="flex-1 font-bold text-gray-200 basis-1/6 dark:text-neutral-400">Trạng thái</p>
                <p className="flex-1 basis-5/6">{manga.completed ? "Hoàn thành" : "Đang tiến hành"}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-row flex-wrap items-center md:mt-2 ">
            <p className="mb-1 text-sm font-bold basis-44 xl:basis-56 md:text-base">Chapter mới nhất</p>
            {/* latest chapter */}
            <div className="flex flex-row items-center mb-1 basis-64 xl:basis-80 gap-x-5">
              {manga.chapters.length && (
                <Link
                  href={`/manga/${manga.href}/chapter-${manga.chapters[0].num}`}
                  className="px-2.5 py-1 text-sm md:text-base font-bold text-gray-200 transition-colors bg-gray-100 rounded-lg hover:bg-main-green hover:text-white"
                >
                  Chapter {manga.chapters[0] ? `${manga.chapters[0].num}` : "0"}
                </Link>
              )}
              <p className="text-sm md:text-base">{manga.chapters[0] ? `${formatDistanceToNowStrict(parseISO(manga.chapters[0].updatedAt as unknown as string), { locale: vi })}` : "Đang cập nhật"}</p>
            </div>
            {/* star */}
            <div className="basis-auto">
              <RatingStar manga={manga} starSize="h-3.5 md:h-4" fontSize="text-sm md:text-base" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}