import { initialMangaState } from "@/features/mangaHref/MangaSlice"
import { useRouter } from "next/router"
import { useState } from "react"
import { PulseLoader } from "react-spinners"
import { toast } from "react-toastify"

export default function AdminDeleteMangaModal({
  isOpenDeleteModal, setIsOpenDeleteModal, countdown, mangaState
}: {
  isOpenDeleteModal: boolean, setIsOpenDeleteModal: any, countdown: number, mangaState: typeof initialMangaState[number]
}) {
  const router = useRouter()
  const [isDeletingManga, setIsDeletingManga] = useState<boolean>(false)
  return (
    <div className="relative inline">
      {/* delete manga modal */}
      <div
        className={`${isOpenDeleteModal ? "scale-100 -translate-y-full opacity-100" : "scale-0 -translate-y-1/2 opacity-0"} absolute transition-all duration-200 -top-1 grid grid-cols-1 content-evenly border-2 border-red-500 w-[200px] -translate-x-1/2 bg-white dark:bg-neutral-750 z-10 rounded-md h-[100px] left-1/2`}
      >
        <p className="font-semibold text-center">Bạn có chắc muốn xóa truyện này?</p>
        <form
          className="flex flex-row place-content-center gap-x-2"
          onSubmit={async (e) => {
            e.preventDefault()
            setIsDeletingManga(true)
            const result = await fetch(`/api/admin/delete_manga?href=${mangaState.href}`)
            const res = await result.json()
            console.log("🚀 ~ file: name.tsx:39 ~ onSubmit={ ~ res:", res)
            if (res.message) {
              router.replace("/")
              toast.success(`Đã xóa truyện ${mangaState.name}`)
            } else if (res.error) {
              alert(res.error)
            }
            setIsDeletingManga(false)
          }}
        >
          <button
            type="button"
            className="px-2 py-1 font-semibold rounded bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 hover:bg-neutral-300 transition-colors"
            onClick={() => setIsOpenDeleteModal(false)}
          >
            Không
          </button>
          <button
            type="submit"
            className={`${countdown >= 0 || isDeletingManga ? "bg-red-600 text-white/80 px-3" : "bg-red-500 px-2"} py-1 font-semibold text-white rounded hover:bg-red-600 transition-colors`}
            disabled={countdown >= 0 || isDeletingManga}
          >

            {isDeletingManga ? (
              <PulseLoader color="#ffffff" size={8} />
            ) : (
              <>
                {countdown >= 0 ? <span>{countdown}</span> : "Có"}
              </>
            )}
          </button>
        </form>
      </div>
      {/* delete manga button */}
      <button
        className="px-2 py-1 group hover:bg-red-500 rounded transition-colors"
        onClick={() => setIsOpenDeleteModal((prevState: any) => !prevState)}
      >
        <svg className="h-4 fill-red-500 group-hover:fill-white transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" /></svg>
      </button>
    </div>
  )
}