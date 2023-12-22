import { useState } from "react"
import { PulseLoader } from "react-spinners"
import { useRouter } from "next/router"
import { ChapterResponse } from "@/type"
import { toast } from "react-toastify"

export default function AdminDeleteChapter({ chapter, prevChapter }: { chapter: ChapterResponse, prevChapter: string }) {
  const router = useRouter()
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false)
  const [isDeletingChapter, setIsDeletingChapter] = useState<boolean>(false)
  return (
    <>
      <div className="relative max-w-fit">
        {/* delete button */}
        <button
          className="px-2 py-1.5 group hover:bg-red-500 rounded transition-colors"
          onClick={() => setIsOpenDeleteModal((prevState) => !prevState)}
        >
          <svg className="h-4 fill-red-500 group-hover:fill-white transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" /></svg>
        </button>
        {/* delete modal */}
        <div className={`${isOpenDeleteModal ? "scale-100 -translate-y-full opacity-100" : "scale-0 -translate-y-1/2 translate-x-1/2 opacity-0"} transition-all duration-200 absolute right-0 -top-1 w-[170px] h-[75px] rounded-md grid place-content-evenly bg-white dark:bg-neutral-750`}>
          <p className="font-medium text-center">Xóa chapter này?</p>
          <form
            className="mx-auto space-x-2"
            onSubmit={async (e) => {
              e.preventDefault()
              setIsDeletingChapter(true)
              const result = await fetch(`/api/admin/delete_chapters?href=${chapter.data?.href}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  chapters: [chapter.data?.chapter.num]
                })
              })
              const res = await result.json()
              console.log("🚀 ~ file: [chapterNum].tsx:164 ~ onSubmit={ ~ res:", res)
              if (res.message) {
                router.replace(`/manga/${chapter.data?.href}/chapter-${prevChapter}`)
                toast.success(`Xóa chap ${chapter.data?.chapter.num} thành công`)

              } else if (res.error) {
                alert(res.error)
              }
              setIsDeletingChapter(false)
              setIsOpenDeleteModal(false)
            }}
          >
            <button
              type="button"
              className="px-2 py-1 font-semibold rounded bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors"
              onClick={() => setIsOpenDeleteModal(false)}
            >
              Không
            </button>
            <button
              type="submit"
              className={`${isDeletingChapter ? "bg-red-600 text-white/80" : "bg-red-500 opacity-100 hover:bg-red-600"} px-2 py-1 font-semibold text-white rounded transition-colors`}
              disabled={isDeletingChapter}
            >
              {isDeletingChapter ? (
                <PulseLoader color="#ffffff" size={8} />
              ) : "Có"}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}