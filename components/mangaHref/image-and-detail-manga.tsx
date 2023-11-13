import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { MangaType } from "@/models/manga"
import { MangaResponse } from "@/type"
import { useDispatch, useSelector } from "react-redux"
import { addOrUpdateManga } from "@/features/mangaHref/MangaSlice"
import { selectAdminMode, toggleAdminMode } from "@/features/GlobalSlice"
import { useRouter } from "next/router"
import Image from "next/image"
import { BarLoader } from "react-spinners"
import DetailManga from "./detail-manga"
import dynamic from "next/dynamic"
import DotLoaderComponent from "../global/dot-loader"
const DynamicAdminImage = dynamic(() => import("./admin/admin-image"), {
  ssr: false,
  loading: () => <DotLoaderComponent size={40} heightIsFull={true} />
})
const DynamicAdminDetailManga = dynamic(() => import("./admin/admin-detail-manga"), {
  ssr: false,
  loading: () => <DotLoaderComponent size={40} heightIsFull={true} />
})

export default function ImageAndDetailManga({
  mangaState, chapters, description, setDescription, handleScroll
}: {
  mangaState: MangaType | Omit<MangaType, "chapters">, chapters: MangaType["chapters"] | undefined, description: string, setDescription: Dispatch<SetStateAction<string>>, handleScroll: () => void
}) {
  const dispatch = useDispatch()
  const router = useRouter()
  const adminMode = useSelector(selectAdminMode)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [file, setFile] = useState<File>()
  const [name, setName] = useState<string>("")
  const [otherName, setOtherName] = useState<string>("")
  const [author, setAuthor] = useState<string>("")
  const [tags, setTags] = useState<string[]>([])
  const [completed, setCompleted] = useState<boolean>(false)
  // Set Manga State
  useEffect(() => {
    if (mangaState) {
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
            <DynamicAdminImage
              file={file}
              mangaState={mangaState}
              handleOnChange={(e: any) => {
                if (e.target.files) {
                  setFile(e.target.files[0])
                }
              }}
            />
          ) : (
            <Image
              className="block w-full h-full mx-auto object-cover"
              src={mangaState.image.url}
              alt=""
              fill={true}
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
        {adminMode && (
          <DynamicAdminDetailManga
            name={name}
            setName={setName}
            otherName={otherName}
            setOtherName={setOtherName}
            author={author}
            setAuthor={setAuthor}
            completed={completed}
            setCompleted={setCompleted}
            tags={tags}
            setTags={setTags}
            isUpdating={isUpdating}
            mangaState={mangaState}
            setDescription={setDescription}
            setFile={setFile}
          />
        )}
        {/* user mode */}
        <div className={`${!adminMode ? "block" : "hidden"}`}>
          <DetailManga manga={mangaState as any} chapters={chapters} handleScroll={handleScroll} />
        </div>
      </div>
    </form>
  )
}