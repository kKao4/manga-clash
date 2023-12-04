import { ChapterResponse, ChaptersResponse } from "@/type";
import { useRouter } from "next/router";
import { useState, useEffect } from "react"
import Select from "./Select";
import { motion } from "framer-motion";

export default function Menu({
  chapters, prevChapter, nextChapter, readingStyle, setReadingStyle, index, setIndex, chapter
}: {
  chapters: ChaptersResponse["data"], prevChapter: string, nextChapter: string, readingStyle: "full" | "single", setReadingStyle: any, index: number, setIndex: any, chapter: ChapterResponse["data"]
}) {
  const router = useRouter()
  const [isFirstChapter, setIsFirstChapter] = useState<boolean>(false)
  const [isLastChapter, setIsLastChapter] = useState<boolean>(false)
  useEffect(() => {
    if (router.query.chapterNum && !Array.isArray(router.query.chapterNum)) {
      setIsFirstChapter(router.query.chapterNum.split("-")[1] === (chapters?.chapters[chapters.chapters.length - 1].num?.toString()))
      setIsLastChapter(router.query.chapterNum.split("-")[1] === (chapters?.chapters[0].num?.toString()))
    }
  }, [router, chapters])
  return (
    <div className="flex flex-col md:flex-row gap-y-2">
      <div className="gap-x-3 gap-y-2 flex flex-col md:flex-row">
        {/* select chapter  */}
        <Select
          width="w-full md:w-[320px] xl:w-[400px]"
          value={typeof router.query.chapterNum === "string" ? router.query.chapterNum?.split("-")[1] : ""}
          handleOnChange={(e: any) => router.push(`/manga/${router.query.mangaHref}/chapter-${e.target.value}`)}
        >
          {chapters?.chapters.map(chapter => {
            return (
              <option
                key={chapter.num}
                value={chapter.num}
              >
                Chapter {chapter.num}{chapter.description && ` - ${chapter.description}`}
              </option>
            )
          })}
        </Select>
        {/* select reading style  */}
        <div className="flex flex-row gap-x-2">
          <Select
            width="w-fit"
            value={readingStyle}
            handleOnChange={(e: any) => {
              setReadingStyle(e.target.value)
              // set localStorage for reading style
              localStorage.setItem("readingStyle", e.target.value)
            }}
          >
            <option value="full">Full Page</option>
            <option value="single">Single Page</option>
          </Select>
          {readingStyle === "single" && (
            <div className="md:hidden block">
              <Select
                width="w-[88px]"
                value={(index + 1).toString()}
                handleOnChange={(e: any) => setIndex(Number(e.target.value) - 1)}
                contentCenter={true}
              >
                {Array.from({ length: chapter!.chapter.imagesPath.length }, (_, i) => i + 1).map(i => {
                  return <option key={i} value={i}>{i}/{chapter!.chapter.imagesPath.length}</option>
                })}
              </Select>
            </div>
          )}
        </div>
      </div>
      {/* prev/next button & select page */}
      {router.query.chapterNum && !Array.isArray(router.query.chapterNum) && (
        <>
          <div className="flex flex-row mx-auto space-x-2 sm:ml-auto sm:mr-0">
            {readingStyle === "single" && (
              <div className="md:block hidden">
                <Select
                  width="w-[88px]"
                  value={(index + 1).toString()}
                  handleOnChange={(e: any) => setIndex(Number(e.target.value) - 1)}
                  contentCenter={true}
                >
                  {Array.from({ length: chapter!.chapter.imagesPath.length }, (_, i) => i + 1).map(i => {
                    return <option key={i} value={i}>{i}/{chapter!.chapter.imagesPath.length}</option>
                  })}
                </Select>
              </div>
            )}

            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`${isFirstChapter ? "bg-[#225d51] text-neutral-300" : "bg-second-green hover:bg-black text-white"} flex flex-row items-center font gap-x-1.5 transition-colors px-4 py-2 rounded-md`}
              disabled={isFirstChapter}
              onClick={() => {
                router.push(`/manga/${router.query.mangaHref}/chapter-${prevChapter}`)
              }}
            >
              <svg className={`${isFirstChapter ? "fill-neutral-300" : "fill-white"} h-3.5`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" /></svg>
              Chap trước
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`${isLastChapter ? "bg-[#225d51] text-neutral-300" : "bg-second-green hover:bg-black text-white"} flex flex-row items-center font gap-x-1.5 transition-colors px-4 py-2 rounded-md`}
              disabled={isLastChapter}
              onClick={() => {
                router.push(`/manga/${router.query.mangaHref}/chapter-${nextChapter}`)
              }}
            >
              Chap sau
              <svg className={`${isLastChapter ? "fill-neutral-300" : "fill-white"} h-3.5`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" /></svg>
            </motion.button>
          </div>
        </>
      )}
    </div>
  )
}