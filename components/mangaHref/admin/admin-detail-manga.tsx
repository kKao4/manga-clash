import { toggleAdminMode } from "@/features/GlobalSlice"
import { initialMangaState } from "@/features/mangaHref/MangaSlice"
import { tagsArray } from "@/type"
import { useDispatch } from "react-redux"
import { motion } from "framer-motion"

export default function AdminDetailManga({
  name, setName, otherName, setOtherName, author, setAuthor, completed, setCompleted, tags, setTags, isUpdating, mangaState, setDescription, setFile
}: {
  name: string, setName: any, otherName: string, setOtherName: any, author: string, setAuthor: any, completed: boolean, setCompleted: any, tags: string[], setTags: any, isUpdating: boolean, mangaState: typeof initialMangaState[number], setDescription: any, setFile: any
}) {
  const dispatch = useDispatch()
  return (
    <div className="flex flex-col gap-y-2.5">
      <div className="flex flex-col items-start md:items-center sm:flex-row gap-y-1">
        <p className="text-sm font-bold basis-1/6 ml-1 md:ml-0">Tên truyện</p>
        <input
          type="text"
          className={`px-2 py-1.5 rounded w-full focus:outline-none border border-gray-400 dark:border-transparent dark:bg-neutral-700`}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex flex-col items-start md:items-center sm:flex-row gap-y-1">
        <p className="text-sm font-bold basis-1/6 ml-1 md:ml-0">Tên khác</p>
        <input
          type="text"
          className={`px-2 py-1.5 rounded w-full focus:outline-none border border-gray-400 dark:border-transparent dark:bg-neutral-700`}
          value={otherName}
          onChange={(e) => setOtherName(e.target.value)}
        />
      </div>
      <div className="flex flex-row items-end gap-x-2">
        <div className="flex flex-col items-start md:items-center sm:flex-row gap-y-1 basis-1/2 sm:basis-3/4">
          <p className="text-sm font-bold basis-1/4 ml-1 md:ml-0">Tác Giả</p>
          <input
            type="text"
            className={`px-2 py-1.5 rounded w-full focus:outline-none border border-gray-400 dark:border-transparent dark:bg-neutral-700 md:ml-[7px]`}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div className="flex flex-row items-center basis-1/2 sm:basis-1/3 gap-x-2 h-[37.6px]">
          <select
            className="w-full border border-gray-400 h-full dark:border-transparent focus:outline-none rounded px-2 py-1.5 dark:bg-neutral-700" value={completed ? "true" : "false"}
            onChange={(e) => {
              setCompleted(() => e.target.value === "false" ? false : true)
            }}
          >
            <option value="false">Đang tiến hành</option>
            <option value="true">Hoàn thành</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col items-start sm:flex-row gap-y-1">
        <p className="text-sm font-bold basis-1/6 ml-1 md:ml-0">Thể Loại</p>
        <div className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-1">
          {tagsArray.map(tag => {
            return (
              <div key={tag.id} className="flex flex-row items-center col-span-1 gap-x-1 px-1">
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
        <motion.button
          whileTap={{ scale: 0.95 }}
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
            setFile(undefined)
          }}
        >
          Hủy
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          className={`${isUpdating ? "" : "hover:bg-black"} max-w-fit px-4 py-2 bg-second-green text-white font-semibold rounded-md transition-colors`}
          disabled={isUpdating}
        >
          Cập nhật truyện
        </motion.button>
      </div>
    </div>
  )
}