import { useEffect, useRef, useState } from "react"
import Title from "../global/title"
import { useSelector, useDispatch } from "react-redux"
import { selectAdminMode } from "@/features/GlobalSlice"
import { HOST_URL } from "@/type"
import { MangaType } from "@/models/manga"
import { PulseLoader } from "react-spinners"
import Chapter from "./chapter"
import ShowMore from "./show-more"
import { BeatLoader } from "react-spinners"

export default function Chapters({
  mangaState, chaptersOrder, chapters, handleChangeChaptersOrder, setChapters
}: {
  mangaState: MangaType, chaptersOrder: "latest" | "earliest", chapters: MangaType["chapters"], handleChangeChaptersOrder: () => void, setChapters: any
}) {
  const dispatch = useDispatch()
  const adminMode = useSelector(selectAdminMode)
  const showMoreChaptersRef = useRef<HTMLDivElement>(null)
  const [isAddingChapter, setIsAddingChapter] = useState<boolean>(false)
  const [isOpenAddChapter, setIsOpenAddChapter] = useState<boolean>(false)
  const [chapterDescription, setChapterDescription] = useState<string>("")
  const [files, setFiles] = useState<FileList | null>(null)
  const [num, setNum] = useState<string>("")
  const [validChapterMessage, setValidChapterMessage] = useState<string>("")
  const [showMoreChapter, setShowMoreChapter] = useState<boolean>(false)
  const [readChapters, setReadChapters] = useState<string[]>()
  const [checkedChapters, setCheckedChapters] = useState<string[]>([])
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false)
  const [isDeletingChapters, setIsDeletingChapters] = useState<boolean>(false)
  // Get localStorage For This Manga
  useEffect(() => {
    const storedArray = localStorage.getItem(`${mangaState.href}`)
    if (storedArray) {
      const array: string[] | null = JSON.parse(storedArray)
      if (array) {
        setReadChapters(array)
      }
    }
  }, [mangaState])
  // set valid num message
  useEffect(() => {
    if (!num || Number(num) < 0) {
      setValidChapterMessage("Không hợp lệ")
    } else if (chapters?.find((c) => c.num === num)) {
      setValidChapterMessage("Chapter đã tồn tại")
    } else {
      setValidChapterMessage("")
    }
  }, [num, chapters])
  // set biggest number chapter is default value
  useEffect(() => {
    if (chapters && chapters.length) {
      if (chaptersOrder === "latest") {
        setNum((Number(chapters[0].num) + 1).toString())
      } else {
        setNum((Number(chapters[chapters.length - 1].num) + 1).toString())
      }
    } else {
      setNum("")
    }
  }, [chapters, chaptersOrder])
  return (
    <>
      <Title content="CHAPTERS" order={false}>
        {checkedChapters.length ? (
          <div className="relative">
            {/* delete chapters button */}
            <button
              className="px-2.5 py-2 transition-colors rounded-md group hover:bg-red-500"
              onClick={() => setIsOpenDeleteModal(prevState => !prevState)}
            >
              <svg className="h-4 transition-colors fill-red-500 group-hover:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" /></svg>
            </button>
            {/* delete chapters modal */}
            <form
              className={`${isOpenDeleteModal ? "scale-100 -translate-y-full translate-x-0 opacity-100" : "opacity-0 scale-0 -translate-y-1/2 translate-x-1/2"} absolute transition-all shadow grid grid-cols-1 right-0 content-evenly -top-1 duration-200 z-10 border-2 w-[220px] h-[84px] bg-white rounded-md border-second-green`}
              onSubmit={async (e) => {
                e.preventDefault()
                setIsDeletingChapters(true)
                const result = await fetch(`${HOST_URL}/api/admin/delete_chapters?href=${mangaState.href}`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    chapters: checkedChapters
                  })
                })
                const res = await result.json()
                console.log("🚀 ~ file: chapters.tsx:75 ~ onSubmit={ ~ res:", res)
                if (res.message) {
                  setCheckedChapters([])
                  setIsOpenDeleteModal(false)
                  const mangaResult = await fetch(`${HOST_URL}/api/manga/${mangaState.href}`)
                  const mangaRes = await mangaResult.json()
                  setChapters(mangaRes.data.chapters)
                  setIsDeletingChapters(false)
                } else if (res.error) {
                  alert(res.error)
                }
              }}
            >
              <p className="font-bold text-center">Xóa {checkedChapters.length} chapter đã chọn</p>
              <div className="mx-auto space-x-2 max-w-fit">
                <button
                  type="button"
                  className="px-2 py-1 font-semibold rounded bg-neutral-200 hover:bg-neutral-300"
                  onClick={() => setIsOpenDeleteModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={`${isDeletingChapters ? "" : "hover:bg-black"} px-2 py-1 font-semibold text-white rounded bg-second-green`}
                  disabled={isDeletingChapters}
                >
                  {isDeletingChapters ? (
                    <BeatLoader size={9} color="#ffffff" />
                  ) : "Xác nhận"}
                </button>
              </div>
            </form>
          </div>
        ) : ""}
        <button
          className="px-2 py-2 ml-1 transition-colors rounded-md group hover:bg-second-green"
          title="Change order"
          onClick={handleChangeChaptersOrder}
        >
          {chaptersOrder === "latest" ? (
            <svg className="h-4 transition-colors fill-second-green group-hover:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M160 480c9 0 17.5-3.8 23.6-10.4l88-96c11.9-13 11.1-33.3-2-45.2s-33.3-11.1-45.2 2L192 365.7V64c0-17.7-14.3-32-32-32s-32 14.3-32 32V365.7L95.6 330.4c-11.9-13-32.2-13.9-45.2-2s-13.9 32.2-2 45.2l88 96C142.5 476.2 151 480 160 480zM450.7 294c-8.3-6-19.1-7.7-28.8-4.4l-48 16c-16.8 5.6-25.8 23.7-20.2 40.5s23.7 25.8 40.5 20.2l5.9-2V416H384c-17.7 0-32 14.3-32 32s14.3 32 32 32h48 48c17.7 0 32-14.3 32-32s-14.3-32-32-32H464V320c0-10.3-4.9-19.9-13.3-26zM418.3 91a32 32 0 1 1 27.4 57.9A32 32 0 1 1 418.3 91zM405.1 203.8l-6.8 9.2c-10.5 14.2-7.5 34.2 6.7 44.8s34.2 7.5 44.8-6.7l48.8-65.8c14-18.9 21.5-41.7 21.5-65.2c0-48.6-39.4-88-88-88s-88 39.4-88 88c0 39.2 25.6 72.4 61.1 83.8z" /></svg>
          ) : (
            <svg className="h-4 transition-colors fill-second-green group-hover:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M450.7 38c8.3 6 13.3 15.7 13.3 26v96h16c17.7 0 32 14.3 32 32s-14.3 32-32 32H432 384c-17.7 0-32-14.3-32-32s14.3-32 32-32h16V108.4l-5.9 2c-16.8 5.6-34.9-3.5-40.5-20.2s3.5-34.9 20.2-40.5l48-16c9.8-3.3 20.5-1.6 28.8 4.4zM160 32c9 0 17.5 3.8 23.6 10.4l88 96c11.9 13 11.1 33.3-2 45.2s-33.3 11.1-45.2-2L192 146.3V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V146.3L95.6 181.6c-11.9 13-32.2 13.9-45.2 2s-13.9-32.2-2-45.2l88-96C142.5 35.8 151 32 160 32zM445.7 364.9A32 32 0 1 0 418.3 307a32 32 0 1 0 27.4 57.9zm-40.7 54.9C369.6 408.4 344 375.2 344 336c0-48.6 39.4-88 88-88s88 39.4 88 88c0 23.5-7.5 46.3-21.5 65.2L449.7 467c-10.5 14.2-30.6 17.2-44.8 6.7s-17.2-30.6-6.7-44.8l6.8-9.2z" /></svg>
          )}
        </button>
      </Title>
      <div className="relative">
        {/* add chapter modal */}
        <form
          className={`${isOpenAddChapter ? "scale-100 -translate-y-full opacity-100" : "opacity-0 scale-0 -translate-y-1/2 -translate-x-1/2"} grid grid-cols-2 gap-x-3 px-3 absolute transition-all duration-200 w-full sm:w-[300px] h-[160px] rounded-md shadow border-2 border-second-green bg-white z-10 content-evenly top-2`}
          onSubmit={async (e) => {
            e.preventDefault()
            setIsAddingChapter(true)
            const formData = new FormData()
            formData.append("num", num)
            formData.append("description", chapterDescription)
            if (files) {
              for (let i = 0; i < files.length; i++) {
                formData.append("images", files[i])
              }
            }
            const result = await fetch(`${HOST_URL}/api/admin/add_and_update_chapter?href=${mangaState.href}`, {
              method: "POST",
              body: formData
            })
            const res = await result.json()
            console.log("🚀 ~ file: chapters.tsx:90 ~ onSubmit={ ~ res:", res)
            if (res.message) {
              setNum("")
              setChapterDescription("")
              setFiles(null)
              const mangaResult = await fetch(`${HOST_URL}/api/manga/${mangaState.href}`)
              const mangaRes = await mangaResult.json()
              setChapters(mangaRes.data.chapters)
              setIsAddingChapter(false)
            } else if (res.error) {
              alert(res.error)
              setIsAddingChapter(false)
            }
          }}
        >
          <div className="col-span-1 space-y-1">
            <input
              type="number"
              min={0}
              value={num}
              className={`${validChapterMessage ? "border-b-red-500 text-red-500" : "border-b-gray-200 "} w-full text-center py-1 border-b focus:outline-none`}
              onChange={(e) => setNum(e.target.value)}
              placeholder="Chapter"
            />
            <p className="text-[13px] text-red-500">{validChapterMessage && validChapterMessage}</p>
          </div>
          <label
            htmlFor="chapters-image"
            className={`${files?.length ? "text-second-green border-second-green hover:bg-second-green" : "text-red-500 border-red-500 hover:bg-red-500"} flex flex-row group hover:text-white col-span-1 py-1 text-sm text-center border-2 rounded cursor-pointer gap-x-1.5 justify-center h-fit`}
          >
            <svg className={`h-4 ${files?.length ? "fill-second-green" : "fill-red-500"} group-hover:fill-white`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3V320c0 17.7 14.3 32 32 32s32-14.3 32-32V109.3l73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64c0 53 43 96 96 96H352c53 0 96-43 96-96V352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V352z" /></svg>
            <span className="font-semibold">{files ? files.length : "0"} ảnh</span>
            <input
              id="chapters-image"
              type="file"
              className="hidden"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
          </label>
          <input
            type="text"
            className="col-span-2 py-1 border-b border-gray-200 focus:outline-none h-fit"
            placeholder="Chú thích (nếu có)"
            value={chapterDescription}
            onChange={(e) => setChapterDescription(e.target.value)}
          />
          <div className="flex flex-row col-span-2 place-content-center gap-x-2">
            <button
              type="button"
              className="px-2 py-1 font-semibold rounded bg-neutral-200 hover:bg-neutral-300"
              onClick={() => setIsOpenAddChapter(false)}
            >
              Hủy
            </button>
            <button
              className={`${isAddingChapter || validChapterMessage !== "" || !files?.length ? "" : "hover:bg-black"} ${validChapterMessage === "" && files?.length ? "bg-second-green" : "bg-red-500"} px-2 py-1 font-semibold text-white rounded`}
              disabled={isAddingChapter || validChapterMessage !== "" || !files?.length}
            >
              {isAddingChapter ? (
                <PulseLoader size={8} margin={2} color="#ffffff" />
              ) : "Xác nhận"}
            </button>
          </div>
        </form>
        <div ref={showMoreChaptersRef} className="relative py-3 grid grid-cols-1 sm:grid-cols-3 overflow-hidden max-h-[550px] transition-all duration-400">
          {/* add chapter button */}
          {adminMode && (
            <div className="relative col-span-1">
              <button
                className={`hover:bg-second-green border-second-green w-full flex flex-row items-center border-2 group rounded-md justify-center gap-x-2 py-3 min-h-full transition-colors`}
                onClick={() => setIsOpenAddChapter(prevState => !prevState)}
              >
                <svg className={`fill-second-green group-hover:fill-white h-5 transition-colors`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" /></svg>
                <span
                  className={`text-second-green group-hover:text-white font-bold transition-colors`}
                >
                  Thêm Chapter
                </span>
              </button>
            </div>
          )}
          {/* chapter display */}
          {chapters?.map(chapter => {
            return (
              <Chapter
                key={chapter.num}
                chapter={chapter}
                readChapters={readChapters}
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
            <div className="absolute w-full h-8 bottom-0 bg-gradient-to-t from-white to-[rgba(255,255,255,0)]"></div>
          )}
        </div></div>
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