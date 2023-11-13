import { MangaType } from "@/models/manga"
import Image from "next/image"
import RowChapter from "./row-chapter"
import Link from "next/link"

export default function MangaBoxPopular({ manga }: { manga: MangaType }) {
  return (
    <div className="flex flex-row col-span-1 gap-x-5">
      {/* TODO: RESPONSIVE FOR HISTORY AND SINGLE PAGE READ style read per page and add lazy ladoing in settings and image slider in homepage fix user dropdown in search page */}
      {/* image */}
      <Link href={`/manga/${manga.href}`} className="relative w-16 h-[86px] overflow-hidden cursor-pointer group/image shrink-0">
        <div className="absolute top-0 left-0 z-10 w-full h-full transition-colors overflow-hidden duration-200 ease-linear bg-transparent group-hover/image:bg-black/20"></div>
        {manga.image ? (
          <Image className="w-full h-full transition-transform duration-550 group-hover/image:scale-107 object-cover" src={manga.image.url} alt="" fill={true} />
        ) : (
          <div className="w-full h-full bg-gray-150 animate-pulse"></div>
        )}
      </Link>
      <div className="flex flex-col w-full gap-y-2">
        {/* name */}
        <Link href={`/manga/${manga.href}`} className="font-bold cursor-pointer text-2sm line-clamp-2 hover:text-second-green">{manga.name}</Link>
        {/* 2 chapters */}
        {manga.chapters[0] && (
          <RowChapter manga={manga} i={0} />
        )}
        {manga.chapters[1] && (
          <RowChapter manga={manga} i={1} />
        )}
      </div>
    </div>
  )
}