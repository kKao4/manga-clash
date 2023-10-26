import { ChapterResponse, ChaptersResponse } from "@/type"
import Link from "next/link"
import { useRouter } from "next/router"

export default function NavChapter({
  showNavChapter, prevChapter, chapter, nextChapter, chapters
}: {
  showNavChapter: boolean, chapter: ChapterResponse["data"], chapters: ChaptersResponse["data"], prevChapter: string, nextChapter: string
}) {
  const router = useRouter()
  return (
    <div className={`${showNavChapter ? "h-11 opacity-100" : "h-0 opacity-0"} fixed bottom-0 z-20 transition-all duration-200 w-full bg-neutral-700`}>
      <div className="flex flex-row w-full h-full border-t border-gray-200">
        <div className="basis-1/4">
          <Link href={`/manga/${chapter?.href}/chapter-${prevChapter}`} className="flex items-center justify-center w-full h-full">
            <svg className="h-5 dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4L288 214.3V256v41.7L459.5 440.6zM256 352V256 128 96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160C4.2 237.5 0 246.5 0 256s4.2 18.5 11.5 24.6l192 160c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V352z" /></svg>
          </Link>
        </div>
        <div className="basis-1/4">
          <Link href={`/manga/${chapter?.href}`} className="flex items-center justify-center w-full h-full">
            <svg className="h-5 dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M543.8 287.6c17 0 32-14 32-32.1c1-9-3-17-11-24L512 185V64c0-17.7-14.3-32-32-32H448c-17.7 0-32 14.3-32 32v36.7L309.5 7c-6-5-14-7-21-7s-15 1-22 8L10 231.5c-7 7-10 15-10 24c0 18 14 32.1 32 32.1h32v69.7c-.1 .9-.1 1.8-.1 2.8V472c0 22.1 17.9 40 40 40h16c1.2 0 2.4-.1 3.6-.2c1.5 .1 3 .2 4.5 .2H160h24c22.1 0 40-17.9 40-40V448 384c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32v64 24c0 22.1 17.9 40 40 40h24 32.5c1.4 0 2.8 0 4.2-.1c1.1 .1 2.2 .1 3.3 .1h16c22.1 0 40-17.9 40-40V455.8c.3-2.6 .5-5.3 .5-8.1l-.7-160.2h32z" /></svg>
          </Link>
        </div>
        <div className="flex items-center justify-center basis-1/4">
          <div className="relative w-full h-full overflow-hidden">
            <select
              value={chapter?.chapter.num}
              className="w-full h-full px-3 py-2 text-center transition-colors rounded-md bg-neutral-700 dark:text-white focus:outline-none" id="select-chapter"
              onChange={(e) => router.push(`/manga/${router.query.mangaHref}/chapter-${e.target.value}`)}
              style={{ appearance: "none" }}
            >
              {chapters?.chapters.map(chapter => {
                return (
                  <option
                    key={chapter}
                    value={chapter}
                  >
                    Chapter {chapter}
                  </option>
                )
              })}
            </select>
            <span className="absolute top-0 right-0 w-6 h-full transition-colors rounded-md bg-neutral-700">
              <svg className="block w-2 h-full mx-auto dark:fill-neutral-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z" /></svg>
            </span>
          </div>
        </div>
        <div className="basis-1/4">
          <Link href={`/manga/${chapter?.href}/chapter-${nextChapter}`} className="flex items-center justify-center w-full h-full">
            <svg className="h-5 dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3V256v41.7L52.5 440.6zM256 352V256 128 96c0-12.4 7.2-23.7 18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29V352z" /></svg>
          </Link>
        </div>
      </div>
    </div>
  )
}