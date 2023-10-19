import { initialMangaState } from "@/features/mangaHref/MangaSlice"
import { ChapterResponse } from "@/type"
import Link from "next/link"
import { useRouter } from "next/router"

export default function Navigation({ manga }: { manga: typeof initialMangaState[number] | ChapterResponse["data"] | null }) {
  const router = useRouter()
  return (
    <div className="flex flex-row gap-x-1.5 py-4 sm:py-6 flex-wrap items-center">
      <Link
        href="/"
        className="text-sm transition-colors text-gray-text hover:text-second-green"
      >
        Trang chủ
      </Link>
      <span className={`text-sm ${router.query.chapterNum ? "dark:text-white" : ""}`}>/</span>
      <Link
        href="/manga"
        className="text-sm transition-colors text-gray-text hover:text-second-green"
      >
        Truyện
      </Link>
      {manga && (
        <>
          <span className={`text-sm ${router.query.chapterNum ? "dark:text-white" : ""}`}>/</span>
          <Link
            href={`/manga/${manga.href}`}
            className={`text-sm transition-colors ${router.query.mangaHref === manga.href && !("chapter" in manga) ? "text-second-green" : "text-gray-text hover:text-second-green"}`}
          >
            {manga.name}
          </Link>
          {"chapter" in manga && (
            <>
              <span className="text-sm dark:text-white">/</span>
              <Link
                href={`/manga/${manga.href}/chapter-${manga.chapter.num}`}
                className={`text-sm transition-colors text-gray-text hover:text-second-green ${router.query.chapterNum === "chapter-" + (manga.chapter.num).toString() ? "text-second-green" : "text-gray-text hover:text-second-green"}`}
              >
                Chapter {manga.chapter.num}
              </Link>.
            </>
          )}
        </>
      )}
    </div>
  )
}