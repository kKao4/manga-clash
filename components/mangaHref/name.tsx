import { selectAdminMode } from "@/features/GlobalSlice";
import { initialMangaState } from "@/features/mangaHref/MangaSlice";
import { HOST_URL } from "@/type";
import { useEffect } from "react"
import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function Name({ mangaState }: { mangaState: typeof initialMangaState[number] }) {
  const router = useRouter()
  const adminMode = useSelector(selectAdminMode)
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false)
  const [countdown, setCountdown] = useState<number>(5)
  // set countdown for submit button
  useEffect(() => {
    if (isOpenDeleteModal && countdown >= 0) {
      const timeOut = setTimeout(() => {
        setCountdown(prevCountdown => prevCountdown - 1)
      }, 1000)
      return () => clearTimeout(timeOut)
    } else if (!isOpenDeleteModal) {
      setCountdown(5)
    }
  }, [isOpenDeleteModal, countdown])
  return (
    <div className="flex flex-row items-center gap-x-1">
      <p className="text-2xl font-bold text-second-green">{mangaState.name}</p>
      {adminMode && (
        <div className="relative">
          {/* delete manga modal */}
          <div
            className={`${isOpenDeleteModal ? "scale-100 -translate-y-full" : "scale-0 -translate-y-1/2"} absolute transition-all duration-200 -top-1 grid grid-cols-1 content-evenly border-2 border-red-500 w-[200px] -translate-x-1/2 bg-white z-10 rounded-md h-[100px] left-1/2`}
          >
            <p className="font-semibold text-center">Bạn có chắc muốn xóa truyện này?</p>
            <form
              className="flex flex-row place-content-center gap-x-2"
              onSubmit={async (e) => {
                e.preventDefault()
                const result = await fetch(`${HOST_URL}/api/admin/delete_manga?href=${mangaState.href}`)
                const res = await result.json()
                console.log("🚀 ~ file: name.tsx:39 ~ onSubmit={ ~ res:", res)
                if (res.message) {
                  router.replace("/")
                } else if (res.error) {
                  alert(res.error)
                }
              }}
            >
              <button
                type="button"
                className="px-2 py-1 font-semibold rounded bg-neutral-200 hover:bg-neutral-300"
                onClick={() => setIsOpenDeleteModal(false)}
              >
                Không
              </button>
              <button
                type="submit"
                className={`${countdown >= 0 ? "bg-red-600 text-white/80 px-3" : "bg-red-500 px-2"} py-1 font-semibold text-white rounded hover:bg-red-600`}
                disabled={countdown >= 0}
              >
                {countdown >= 0 ? <span>{countdown}</span> : "Có"}
              </button>
            </form>
          </div>
          {/* delete manga button */}
          <button
            className="px-1.5 py-1 group hover:bg-red-500 rounded transition-colors"
            onClick={() => setIsOpenDeleteModal(prevState => !prevState)}
          >
            <svg className="h-4 fill-red-500 group-hover:fill-white transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" /></svg>
          </button>
        </div>
      )}
    </div>
  )
}