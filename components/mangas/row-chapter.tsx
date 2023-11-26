import { MangaType } from "@/models/manga"
import { formatDistanceToNowStrict, parseISO } from "date-fns"
import { vi } from "date-fns/locale"
import Link from "next/link"

export default function RowChapter({ manga, i }: { manga: MangaType, i: number }) {
  return (
    <div className="flex flex-row items-center mt-1 max-w-[240px]">
      <div className="basis-1/2">
        <Link
          href={`/manga/${manga.href}/chapter-${manga.chapters[i].num}`}
          className="px-2.5 py-[0.3125rem] text-sm font-bold text-gray-200 transition-colors bg-gray-100 dark:bg-neutral-700 dark:text-neutral-400 dark:hover:bg-main-green dark:hover:text-white rounded-lg hover:bg-main-green hover:text-white shrink-0"
        >
          Chapter {manga.chapters[i].num}
        </Link>
      </div>
      <p className="text-sm">{formatDistanceToNowStrict(parseISO(manga.chapters[i].updatedAt as unknown as string), { locale: vi })}</p>
    </div>
  )
}