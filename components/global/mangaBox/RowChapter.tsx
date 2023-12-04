import { MangaType } from "@/models/manga"
import { formatDistanceToNowStrict, parseISO } from "date-fns"
import { vi } from "date-fns/locale"
import Link from "next/link"
import { motion } from "framer-motion"

export default function RowChapter({ manga, i, paddingChapter, fontSize, className }: { manga: MangaType, i: number, paddingChapter: string, fontSize: string, className?: string }) {
  return (
    <div className={`flex flex-row items-center max-w-[240px] ${className}`}>
      <div className="basis-1/2">
        <motion.button
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href={`/manga/${manga.href}/chapter-${manga.chapters[i].num}`}
            className={`${paddingChapter} ${fontSize} btn-chapter`}
          >
            Chapter {manga.chapters[i].num}
          </Link>
        </motion.button>
      </div>
      <p className={`${fontSize}`}>{formatDistanceToNowStrict(parseISO(manga.chapters[i].updatedAt as unknown as string), { locale: vi })}</p>
    </div>
  )
}