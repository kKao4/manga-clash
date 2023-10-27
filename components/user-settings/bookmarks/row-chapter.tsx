import { MangaType } from "@/models/manga"
import { formatDistanceToNowStrict, parseISO } from "date-fns"
import { vi } from "date-fns/locale"
import Link from "next/link"

export default function RowChapter({ manga, i }: { manga: MangaType, i: number }) {
  return (
    <div className="flex flex-col items-center gap-y-1">
      <Link
        href={`/manga/${manga.href}/chapter-${manga.chapters[i].num}`}
        className="px-2.5 py-1 text-sm font-bold text-gray-200 transition-colors bg-gray-100 rounded-lg hover:bg-main-green hover:text-white shrink-0"
      >
        Chapter {manga.chapters[i].num}
      </Link>
      <p className="text-sm">{formatDistanceToNowStrict(parseISO(manga.chapters[i].updatedAt as unknown as string), { locale: vi })}</p>
    </div>
  )
}