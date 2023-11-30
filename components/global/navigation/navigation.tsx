import { initialMangaState } from "@/features/mangaHref/MangaSlice"
import { ChapterResponse } from "@/type"
import Link from "next/link"
import { useRouter } from "next/router"

export default function Navigation({ manga }: { manga?: typeof initialMangaState[number] | ChapterResponse["data"] }) {
  const router = useRouter()
  return (
    <div className="space-x-1.5 py-3 md:py-4 items-center">
      <Link
        href="/"
        className="flex-none transition-colors text-2sm md:text-sm text-gray-text hover:text-second-green dark:hover:text-main-green"
      >
        Trang chủ
      </Link>
      <span className="text-2sm md:text-sm text-gray-text">/</span>
      <Link
        href="/manga"
        className="flex-none transition-colors text-2sm md:text-sm text-gray-text hover:text-second-green dark:hover:text-main-green"
      >
        Truyện
      </Link>
      {manga && (
        <>
          <span className="text-2sm md:text-sm text-gray-text">/</span>
          <Link
            href={`/manga/${manga.href}`}
            className={`text-2sm md:text-sm transition-colors line-clamp-1 inline ${!router.query.chapterNum ? "text-second-green dark:text-main-green" : "text-gray-text hover:text-second-green dark:hover:text-main-green"}`}
          >
            {manga.name}
          </Link>
          {router.query.chapterNum && "chapter" in manga && (
            <>
              <span className="text-2sm md:text-sm text-gray-text">/</span>
              <Link
                href={`/manga/${manga.href}/chapter-${manga.chapter.num}`}
                className={`text-2sm md:text-sm transition-colors text-gray-text hover:text-second-green dark:hover:text-main-green ${router.query.chapterNum === "chapter-" + (manga.chapter.num).toString() ? "text-second-green dark:text-main-green" : "text-gray-text hover:text-second-green dark:hover:text-main-green"}`}
              >
                Chapter {manga.chapter.num}
              </Link>
            </>
          )}
        </>
      )}
    </div>
  )
}