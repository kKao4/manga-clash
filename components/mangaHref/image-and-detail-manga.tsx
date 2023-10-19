import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { MangaType } from "@/models/manga"
import {  MangaResponse, tagsArray } from "@/type"
import { useDispatch, useSelector } from "react-redux"
import { addOrUpdateManga } from "@/features/mangaHref/MangaSlice"
import { selectAdminMode, toggleAdminMode } from "@/features/GlobalSlice"
import { useRouter } from "next/router"
import Image from "next/image"
import { BarLoader } from "react-spinners"
import DetailManga from "./detail-manga"

export default function ImageAndDetailManga({
  mangaState, chapters, description, setDescription
}: {
  mangaState: MangaType | Omit<MangaType, "chapters">, chapters: MangaType["chapters"] | undefined, description: string, setDescription: Dispatch<SetStateAction<string>>
}) {
  const dispatch = useDispatch()
  const router = useRouter()
  const adminMode = useSelector(selectAdminMode)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [file, setFile] = useState<File>()
  const [mangaUrl, setMangaUrl] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [otherName, setOtherName] = useState<string>("")
  const [author, setAuthor] = useState<string>("")
  const [tags, setTags] = useState<string[]>([])
  const [completed, setCompleted] = useState<boolean>(false)
  // Set Manga State
  useEffect(() => {
    if (mangaState) {
      setMangaUrl(mangaState.image)
      setName(mangaState.name)
      setOtherName(mangaState.otherName)
      setAuthor(mangaState.author)
      setTags(mangaState.tags)
      setCompleted(mangaState.completed)
      setDescription(mangaState.description)
    }
  }, [mangaState, setDescription])
  return (
    <form
      className="flex flex-col items-center py-6 xl:flex-row gap-x-8 gap-y-4 xl:py-8 xl:items-stretch"
      onSubmit={async (e) => {
        e.preventDefault()
        setIsUpdating(true)
        const formData = new FormData()
        formData.append("name", name)
        formData.append("otherName", otherName)
        formData.append("author", author)
        formData.append("completed", completed.toString())
        tags.forEach(tag => {
          formData.append("tags", tag)
        })
        formData.append("_id", mangaState._id)
        formData.append("description", description)
        if (file) {
          formData.append("image", file)
        }
        const result = await fetch(`/api/admin/update_manga`, {
          method: "POST",
          body: formData
        })
        // console.log("🚀 ~ file: image-and-detail-manga.tsx:55 ~ onSubmit={ ~ formData:", [...formData])
        const res = await result.json()
        console.log("🚀 ~ file: image-and-detail-manga.tsx:57 ~ onSubmit={ ~ res:", res)
        if (res.message) {
          const mangaResult = await fetch(`/api/manga/${res.data.href}`)
          const mangaRes: MangaResponse = await mangaResult.json()
          if (mangaRes.data) {
            dispatch(addOrUpdateManga(mangaRes.data))
            setIsUpdating(false)
            dispatch(toggleAdminMode())
          }
          router.replace(`/manga/${res.data.href}`, "", { scroll: false, shallow: true })
        } else if (res.error) {
          alert(res.error)
          router.push("/")
        }
      }}>
      {/* image manga */}
      <div className="flex flex-col items-center justify-center p-4 bg-white basis-1/4 w-fit">
        <div className="w-[193px] h-[274px] relative overflow-hidden">
          {adminMode ? (
            <>
              <label
                className="absolute flex items-center justify-center w-full h-full transition-opacity duration-200 opacity-0 cursor-pointer bg-black/40 hover:opacity-100"
              >
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      setMangaUrl(URL.createObjectURL(e.target.files[0]))
                      if (e.target.files) {
                        setFile(e.target.files[0])
                      }
                    }
                  }}
                />
                <svg className="h-10 fill-gray-150" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM64 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm152 32c5.3 0 10.2 2.6 13.2 6.9l88 128c3.4 4.9 3.7 11.3 1 16.5s-8.2 8.6-14.2 8.6H216 176 128 80c-5.8 0-11.1-3.1-13.9-8.1s-2.8-11.2 .2-16.1l48-80c2.9-4.8 8.1-7.8 13.7-7.8s10.8 2.9 13.7 7.8l12.8 21.4 48.3-70.2c3-4.3 7.9-6.9 13.2-6.9z" /></svg>
              </label>
              <Image
                className="block w-full h-full mx-auto" src={mangaUrl?.startsWith("blob") ? mangaUrl : `/${mangaUrl}`}
                alt=""
                width="193"
                height="274"
                priority={true}
                quality={100}
              />
            </>
          ) : (
            <Image
              className="block w-full h-full mx-auto" src={mangaState.image.startsWith("blob") ? mangaState.image : `/${mangaState.image}`}
              alt=""
              width="193"
              height="274"
              priority={true}
              quality={100}
            />
          )}
        </div>
      </div>
      {/* detail manga */}
      <div className="w-full bg-[rgba(255,255,255,0.5)] p-4 md:p-6 relative">
        {isUpdating && (
          <div className="absolute top-0 left-0 w-full overflow-hidden">
            <BarLoader width={900} color="#409a88" />
          </div>
        )}
        {/* admin mode */}
        <div className={`${adminMode ? "block" : "hidden"}`}>
          <div className="flex flex-col gap-y-2.5">
            <div className="flex flex-col items-center sm:flex-row">
              <p className="text-sm font-bold basis-1/6">Tên truyện</p>
              <input
                type="text"
                className={`px-2 py-1.5 rounded w-full focus:outline-none border border-gray-400`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center sm:flex-row">
              <p className="text-sm font-bold basis-1/6">Tên khác</p>
              <input
                type="text"
                className={`px-2 py-1.5 rounded w-full focus:outline-none border border-gray-400`}
                value={otherName}
                onChange={(e) => setOtherName(e.target.value)}
              />
            </div>
            <div className="flex flex-row items-end gap-x-2">
              <div className="flex flex-col items-center sm:flex-row basis-1/2 sm:basis-3/4">
                <p className="text-sm font-bold basis-1/4">Tác Giả</p>
                <input
                  type="text"
                  className={`px-2 py-1.5 rounded w-full focus:outline-none border border-gray-400 ml-1.5`}
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
              <div className="flex flex-row items-center basis-1/2 sm:basis-1/3 gap-x-2">
                <select
                  className="w-full border border-gray-400 focus:outline-none rounded px-2 py-1.5" value={completed ? "true" : "false"}
                  onChange={(e) => {
                    setCompleted(() => e.target.value === "false" ? false : true)
                  }}
                >
                  <option value="false">Đang tiến hành</option>
                  <option value="true">Hoàn thành</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col items-start sm:flex-row">
              <p className="text-sm font-bold basis-1/6">Thể Loại</p>
              <div className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-1">
                {tagsArray.map(tag => {
                  return (
                    <div key={tag.id} className="flex flex-row items-center col-span-1 gap-x-1">
                      <input
                        type="checkbox"
                        id={tag.id}
                        value={tag.title.toLowerCase()}
                        checked={tags.includes(tag.title.toLowerCase())}
                        onChange={() => {
                          if (tags.includes(tag.title.toLowerCase())) {
                            const newTags = tags.filter((t) => t !== tag.title.toLowerCase())
                            setTags(newTags)
                          } else {
                            const newTags: string[] = [...tags, tag.title.toLowerCase()]
                            setTags(newTags)
                          }
                        }}
                      />
                      <label htmlFor={tag.id} className="select-none">{tag.title}</label>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="flex flex-row mt-2 place-content-center gap-x-2">
              <button
                type="button"
                className={`${isUpdating ? "" : "hover:bg-black"} px-4 py-2 font-semibold border-2 border-second-green rounded-md transition-colors hover:bg-black hover:border-black text-second-green hover:text-white`}
                disabled={isUpdating}
                onClick={() => {
                  setName(mangaState.name)
                  setOtherName(mangaState.otherName)
                  setAuthor(mangaState.author)
                  setTags(mangaState.tags)
                  setCompleted(mangaState.completed)
                  setDescription(mangaState.description)
                  dispatch(toggleAdminMode())
                }}
              >
                Hủy
              </button>
              <button
                type="submit"
                className={`${isUpdating ? "" : "hover:bg-black"} max-w-fit px-4 py-2 bg-second-green text-white font-semibold rounded-md transition-colors`}
                disabled={isUpdating}
              >
                Cập nhật truyện
              </button>
            </div>
          </div>
        </div>
        {/* user mode */}
        <div className={`${!adminMode ? "block" : "hidden"}`}>
          <DetailManga manga={mangaState as any} chapters={chapters} />
        </div>
      </div>
    </form>
  )
}