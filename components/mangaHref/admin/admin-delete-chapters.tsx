import { initialMangaState } from "@/features/mangaHref/MangaSlice"
import { useState } from "react"
import { PulseLoader } from "react-spinners"

export default function AdminDeleteChapters({
  setIsDeletingChapters, checkedChapters, setCheckedChapters, setChapters, isDeletingChapters, mangaState
}: {
  setIsDeletingChapters: any, checkedChapters: string[], setCheckedChapters: any, setChapters: any, isDeletingChapters: boolean, mangaState: typeof initialMangaState[number]
}) {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false)
  return (
    <div className="relative">
      {/* delete chapters button */}
      <button
        className="px-2.5 py-2 transition-colors rounded-md group hover:bg-red-500"
        onClick={() => setIsOpenDeleteModal((prevState: boolean) => !prevState)}
      >
        <svg className="h-4 transition-colors fill-red-500 group-hover:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" /></svg>
      </button>
      {/* delete chapters modal */}
      <form
        className={`${isOpenDeleteModal ? "scale-100 -translate-y-full translate-x-0 opacity-100" : "opacity-0 scale-0 -translate-y-1/2 translate-x-1/2"} absolute transition-all shadow grid grid-cols-1 right-0 content-evenly -top-1 duration-200 z-10 border-2 w-[220px] h-[84px] bg-white rounded-md border-red-500`}
        onSubmit={async (e) => {
          e.preventDefault()
          setIsDeletingChapters(true)
          const result = await fetch(`/api/admin/delete_chapters?href=${mangaState.href}`, {
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
            const mangaResult = await fetch(`/api/manga/${mangaState.href}`)
            const mangaRes = await mangaResult.json()
            console.log("🚀 ~ file: chapters.tsx:75 ~ onSubmit={ ~ mangaRes:", mangaRes)
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
            className={`${isDeletingChapters ? "" : "hover:bg-black"} px-2 py-1 font-semibold text-white rounded bg-red-500`}
            disabled={isDeletingChapters}
          >
            {isDeletingChapters ? (
              <PulseLoader size={9} color="#ffffff" />
            ) : "Có"}
          </button>
        </div>
      </form>
    </div>
  )
}