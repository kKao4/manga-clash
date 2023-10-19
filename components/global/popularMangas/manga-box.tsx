import { MangaType } from "@/models/manga"
import Image from "next/image"
import { format, parseISO, formatDistanceToNowStrict, formatDistanceToNow } from "date-fns"
import newGif from "@/assets/new.gif"
import Link from "next/link"

export default function MangaBoxPopular({ manga }: { manga: MangaType }) {
  return (
    <div className="flex flex-row col-span-1 gap-x-5">
      {/* image */}
      <Link href={`/manga/${manga.href}`} className="relative w-16 h-[86px] overflow-hidden cursor-pointer group/image shrink-0">
        <div className="absolute top-0 left-0 w-full h-full transition-colors bg-transparent duration-200 ease-linear group-hover/image:bg-black/20 z-10"></div>
        {manga.image ? (
          <Image className="w-full h-full transition-transform duration-550 group-hover/image:scale-107" src={`/${manga.image}`} alt="" width="100" height="144" />
        ) : (
          <div className="w-full h-full bg-gray-150 animate-pulse"></div>
        )}
      </Link>
      <div className="flex flex-col gap-y-2">
        {/* name */}
        <Link href={`/manga/${manga.href}`} className="font-bold cursor-pointer text-2sm line-clamp-2 hover:text-second-green">{manga.name}</Link>
        {/* 2 chapters */}
        {manga.chapters[0] && (
          <div className="flex flex-row items-center">
            <Link
              href={`/manga/${manga.href}/chapter-${manga.chapters[0].num}`}
              className="px-2 py-1 text-sm font-bold text-gray-200 transition-colors bg-gray-100 rounded-lg hover:bg-main-green hover:text-white shrink-0"
            >
              Chapter {manga.chapters[0].num}
            </Link>
            {Number(formatDistanceToNowStrict(parseISO(manga.chapters[0].updatedAt as unknown as string), { unit: "day" }).split(" ")[0]) <= 2 ? (
              <p title={formatDistanceToNow(parseISO(manga.chapters[0].updatedAt as unknown as string))}>
                <Image className="ml-8" src={newGif} alt="new" />
              </p>
            ) : (
              <p className="ml-8 text-sm">{format(parseISO(manga.chapters[0].updatedAt as unknown as string), "MM/dd/yyyy")}</p>
            )}
          </div>
        )}
        {manga.chapters[1] && (
          <div className="flex flex-row items-center"> {/* TODO: change hour to day */}
            <Link
              href={`/manga/${manga.href}/chapter-${manga.chapters[1].num}`}
              className="px-2 py-1 text-sm font-bold text-gray-200 transition-colors bg-gray-100 rounded-lg hover:bg-main-green hover:text-white shrink-0"
            >
              Chapter {manga.chapters[1].num}
            </Link>
            {Number(formatDistanceToNowStrict(parseISO(manga.chapters[1].updatedAt as unknown as string), { unit: "day" }).split(" ")[0]) <= 2 ? (
              <p title={formatDistanceToNow(parseISO(manga.chapters[1].updatedAt as unknown as string))}>
                <Image className="ml-8" src={newGif} alt="new" />
              </p>
            ) : (
              <p className="ml-8 text-sm">{format(parseISO(manga.chapters[1].updatedAt as unknown as string), "MM/dd/yyyy")}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}