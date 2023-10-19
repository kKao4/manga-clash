import { ChaptersResponse } from "@/type";
import { useRouter } from "next/router";
import { useState, useEffect } from "react"

export default function Menu({ chapters }: { chapters: ChaptersResponse["data"] }) {
  const router = useRouter()
  const [firstChapter, setFirstChapter] = useState<boolean>(false)
  const [lastChapter, setLastChapter] = useState<boolean>(false)
  const [prevChapter, setPrevChapter] = useState<number>()
  const [nextChapter, setNextChapter] = useState<number>()
  useEffect(() => {
    if (router.query.chapterNum && !Array.isArray(router.query.chapterNum)) {
      setFirstChapter(router.query.chapterNum.split("-")[1] === (chapters?.chapters[chapters.chapters.length - 1]?.toString()))
      setLastChapter(router.query.chapterNum.split("-")[1] === (chapters?.chapters[0]?.toString()))
    }
  }, [router, chapters])
  useEffect(() => {
    if (router.query.chapterNum && !Array.isArray(router.query.chapterNum)) {
      setPrevChapter(Number(router.query.chapterNum.split("-")[1]) - 1)
      setNextChapter(Number(router.query.chapterNum.split("-")[1]) + 1)
    }
  }, [router])
  return (
    <div className="flex flex-col sm:flex-row gap-y-2">
      {/* select chapter  */}
      <div className="relative overflow-hidden">
        <select
          value={typeof router.query.chapterNum === "string" ? router.query.chapterNum?.split("-")[1] : ""}
          className="bg-gray-100 dark:bg-[rgb(77,77,77)] dark:text-white dark:hover:bg-neutral-600 px-3 py-2 w-full sm:min-w-[400px] focus:outline-none peer hover:bg-gray-150 transition-colors rounded-md" id="select-chapter"
          onChange={(e) => router.push(`/manga/${router.query.mangaHref}/chapter-${e.target.value}`)}
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
        <span className="absolute top-0 right-0 w-6 h-10 transition-colors bg-gray-100 rounded-md dark:bg-[rgb(77,77,77)] peer-hover:bg-gray-150 dark:peer-hover:bg-neutral-600">
          <svg className="block w-2 h-full mx-auto dark:fill-neutral-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z" /></svg>
        </span>
      </div>
      {/* prev/next button */}
      {router.query.chapterNum && !Array.isArray(router.query.chapterNum) && (
        <>
          <div className="flex flex-row mx-auto space-x-2 sm:ml-auto sm:mr-0">
            <button
              className={`${firstChapter ? "bg-[#225d51] text-neutral-300" : "bg-second-green hover:bg-black text-white"} flex flex-row items-center font gap-x-1.5 transition-colors px-4 py-2 rounded-md`}
              disabled={firstChapter}
              onClick={() => router.push(`/manga/${router.query.mangaHref}/chapter-${prevChapter}`)}
            >
              <svg className={`${firstChapter ? "fill-neutral-300" : "fill-white"} h-3.5`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" /></svg>
              Chap trước
            </button>
            <button
              className={`${lastChapter ? "bg-[#225d51] text-neutral-300" : "bg-second-green hover:bg-black text-white"} flex flex-row items-center font gap-x-1.5 transition-colors px-4 py-2 rounded-md`}
              disabled={lastChapter}
              onClick={() => router.push(`/manga/${router.query.mangaHref}/chapter-${nextChapter}`)}
            >
              Chap sau
              <svg className={`${lastChapter ? "fill-neutral-300" : "fill-white"} h-3.5`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" /></svg>
            </button>
          </div>
        </>
      )}
    </div>
  )
}