import { Dispatch, SetStateAction, useRef, useState } from "react"
import Title from "../global/Title/Title"
import { useSelector } from "react-redux"
import { selectAdminMode } from "@/features/GlobalSlice"
import { MangaType } from "@/models/manga"
import Chapter from "./Chapter"
import ShowMore from "./ShowMoreButton"
import dynamic from "next/dynamic"
import { useReadLocalStorage } from "usehooks-ts"
const DynamicAdminAddChapterButton = dynamic(() => import("./admin/admin-add-chapter-button"), {
  ssr: false,
})
const DynamicAdminAddChapterModal = dynamic(() => import("./admin/admin-add-chapters-modal"), {
  ssr: false,
})
const DynamicAdminDeleteChapters = dynamic(() => import("./admin/admin-delete-chapters"), {
  ssr: false,
})

export default function Chapters({
  mangaState, chaptersOrder, chapters, handleChangeChaptersOrder, setChapters
}: {
  mangaState: Omit<MangaType, "chapters">, chaptersOrder: "latest" | "earliest", chapters: MangaType["chapters"], handleChangeChaptersOrder: () => void, setChapters: Dispatch<SetStateAction<MangaType["chapters"] | undefined>>
}) {
  const adminMode = useSelector(selectAdminMode)
  const showMoreChaptersRef = useRef<HTMLDivElement>(null)
  const [isOpenAddChapter, setIsOpenAddChapter] = useState<boolean>(false)
  const [showMoreChapter, setShowMoreChapter] = useState<boolean>(false)
  const [checkedChapters, setCheckedChapters] = useState<string[]>([])
  const [isDeletingChapters, setIsDeletingChapters] = useState<boolean>(false)
  const readChapters = useReadLocalStorage(mangaState.href)

  return (
    <>
      <Title content="CHAPTERS" order={false}>
        {checkedChapters.length ? (
          <DynamicAdminDeleteChapters
            setIsDeletingChapters={setIsDeletingChapters}
            checkedChapters={checkedChapters}
            setCheckedChapters={setCheckedChapters}
            setChapters={setChapters}
            isDeletingChapters={isDeletingChapters}
            mangaState={mangaState}
          />
        ) : ""}
        <button
          className="px-2 py-2 ml-1 transition-colors rounded-md group hover:bg-second-green"
          title="Change order"
          onClick={handleChangeChaptersOrder}
        >
          {chaptersOrder === "latest" ? (
            <svg className="h-4 transition-colors fill-second-green dark:fill-main-green group-hover:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M160 480c9 0 17.5-3.8 23.6-10.4l88-96c11.9-13 11.1-33.3-2-45.2s-33.3-11.1-45.2 2L192 365.7V64c0-17.7-14.3-32-32-32s-32 14.3-32 32V365.7L95.6 330.4c-11.9-13-32.2-13.9-45.2-2s-13.9 32.2-2 45.2l88 96C142.5 476.2 151 480 160 480zM450.7 294c-8.3-6-19.1-7.7-28.8-4.4l-48 16c-16.8 5.6-25.8 23.7-20.2 40.5s23.7 25.8 40.5 20.2l5.9-2V416H384c-17.7 0-32 14.3-32 32s14.3 32 32 32h48 48c17.7 0 32-14.3 32-32s-14.3-32-32-32H464V320c0-10.3-4.9-19.9-13.3-26zM418.3 91a32 32 0 1 1 27.4 57.9A32 32 0 1 1 418.3 91zM405.1 203.8l-6.8 9.2c-10.5 14.2-7.5 34.2 6.7 44.8s34.2 7.5 44.8-6.7l48.8-65.8c14-18.9 21.5-41.7 21.5-65.2c0-48.6-39.4-88-88-88s-88 39.4-88 88c0 39.2 25.6 72.4 61.1 83.8z" /></svg>
          ) : (
            <svg className="h-4 transition-colors fill-second-green dark:fill-main-green group-hover:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M450.7 38c8.3 6 13.3 15.7 13.3 26v96h16c17.7 0 32 14.3 32 32s-14.3 32-32 32H432 384c-17.7 0-32-14.3-32-32s14.3-32 32-32h16V108.4l-5.9 2c-16.8 5.6-34.9-3.5-40.5-20.2s3.5-34.9 20.2-40.5l48-16c9.8-3.3 20.5-1.6 28.8 4.4zM160 32c9 0 17.5 3.8 23.6 10.4l88 96c11.9 13 11.1 33.3-2 45.2s-33.3 11.1-45.2-2L192 146.3V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V146.3L95.6 181.6c-11.9 13-32.2 13.9-45.2 2s-13.9-32.2-2-45.2l88-96C142.5 35.8 151 32 160 32zM445.7 364.9A32 32 0 1 0 418.3 307a32 32 0 1 0 27.4 57.9zm-40.7 54.9C369.6 408.4 344 375.2 344 336c0-48.6 39.4-88 88-88s88 39.4 88 88c0 23.5-7.5 46.3-21.5 65.2L449.7 467c-10.5 14.2-30.6 17.2-44.8 6.7s-17.2-30.6-6.7-44.8l6.8-9.2z" /></svg>
          )}
        </button>
      </Title>
      <div className="relative">
        {/* add chapter modal */}
        {adminMode && (
          <DynamicAdminAddChapterModal
            isOpenAddChapter={isOpenAddChapter}
            mangaState={mangaState}
            chaptersOrder={chaptersOrder}
            chapters={chapters}
            setChapters={setChapters}
          />
        )}
        <div ref={showMoreChaptersRef} className="relative py-3 grid grid-cols-1 sm:grid-cols-3 overflow-hidden max-h-[550px] transition-all duration-400">
          {/* add chapter button */}
          {adminMode && (
            <DynamicAdminAddChapterButton setIsOpenAddChapter={setIsOpenAddChapter} />
          )}
          {/* chapter display */}
          {chapters?.map(chapter => {
            return (
              <Chapter
                key={chapter.num}
                chapter={chapter}
                readChapters={readChapters as string[]}
                mangaHref={mangaState.href}
                checked={checkedChapters.includes(chapter.num)}
                handleOnChange={() => setCheckedChapters(prevCheckedChapters => {
                  if (prevCheckedChapters.includes(chapter.num)) {
                    return prevCheckedChapters.filter((checkedChapter) => checkedChapter !== chapter.num)
                  } else {
                    return [...prevCheckedChapters, chapter.num]
                  }
                })}
              />
            )
          })}
          {showMoreChaptersRef.current && showMoreChaptersRef.current.scrollHeight > 550 && (
            <div className="absolute w-full h-8 bottom-0 bg-gradient-to-t from-white to-white/0"></div>
          )}
        </div>
      </div>
      {showMoreChaptersRef.current && showMoreChaptersRef.current.scrollHeight > 550 && (
        <ShowMore showMore={showMoreChapter} handleOnClick={() => {
          setShowMoreChapter(s => !s)
          if (showMoreChaptersRef.current) {
            if (showMoreChapter) {
              showMoreChaptersRef.current.style.maxHeight = "550px"
            } else {
              showMoreChaptersRef.current.style.maxHeight = showMoreChaptersRef.current.scrollHeight + "px"
            }
          }
        }} />
      )}
    </>
  )
}