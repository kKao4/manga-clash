import { MangaType } from "@/models/manga"
import Link from "next/link"

export default function Name({ manga, fontSize }: { manga: MangaType, fontSize: string }) {
  return (
    <Link href={`/manga/${manga.href}`} className={`${fontSize} font-bold transition-colors cursor-pointer line-clamp-2 hover:text-second-green dark:hover:text-third-green`}>
      {manga.name}
    </Link>
  )
}