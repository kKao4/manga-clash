import { initialMangaState } from "@/features/mangaHref/MangaSlice"
import { ChapterResponse } from "@/type"
import Link from "next/link"
import { useRouter } from "next/router"

export default function Navigation({ manga }: { manga: typeof initialMangaState[number] | ChapterResponse["data"] | null }) {
  const router = useRouter()
  return (
    <div className=" space-x-1 py-3 md:py-4 items-center">
      <Link
        href="/"
        className="text-[13px] md:text-sm transition-colors text-gray-text hover:text-second-green flex-none"
      >
        Trang chủ
      </Link>
      <span className={`text-[13px] md:text-sm ${router.query.chapterNum ? "dark:text-white" : ""}`}>/</span>
      <Link
        href="/manga"
        className="text-[13px] md:text-sm transition-colors text-gray-text hover:text-second-green flex-none"
      >
        Truyện
      </Link>
      {manga && (
        <>
          <span className={`text-[13px] md:text-sm ${router.query.chapterNum ? "dark:text-white" : ""}`}>/</span>
          <Link
            href={`/manga/${manga.href}`}
            className={`text-[13px] md:text-sm transition-colors line-clamp-1 inline ${router.query.mangaHref === manga.href && !("chapter" in manga) ? "text-second-green" : "text-gray-text hover:text-second-green"}`}
          >
            {manga.name}
          </Link>
          {"chapter" in manga && (
            <>
              <span className="text-[13px] md:text-sm dark:text-white">/</span>
              <Link
                href={`/manga/${manga.href}/chapter-${manga.chapter.num}`}
                className={`text-[13px] md:text-sm transition-colors text-gray-text hover:text-second-green ${router.query.chapterNum === "chapter-" + (manga.chapter.num).toString() ? "text-second-green" : "text-gray-text hover:text-second-green"}`}
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