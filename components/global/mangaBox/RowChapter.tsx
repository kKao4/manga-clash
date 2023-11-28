import { MangaType } from "@/models/manga"
import { formatDistanceToNowStrict, parseISO } from "date-fns"
import { vi } from "date-fns/locale"
import Link from "next/link"

export default function RowChapter({ manga, i, paddingChapter, fontSize, className }: { manga: MangaType, i: number, paddingChapter: string, fontSize: string, className?: string }) {
  return (
    <div className={`flex flex-row items-center max-w-[240px] ${className}`}>
      <div className="basis-1/2">
        <Link
          href={`/manga/${manga.href}/chapter-${manga.chapters[i].num}`}
          className={`${paddingChapter} ${fontSize} font-bold text-gray-200 transition-colors bg-gray-100 dark:bg-neutral-700 dark:text-neutral-400 dark:hover:bg-main-green dark:hover:text-white rounded-lg hover:bg-main-green hover:text-white shrink-0`}
        >
          Chapter {manga.chapters[i].num}
        </Link>
      </div>
      <p className={`${fontSize}`}>{formatDistanceToNowStrict(parseISO(manga.chapters[i].updatedAt as unknown as string), { locale: vi })}</p>
    </div>
  )
}