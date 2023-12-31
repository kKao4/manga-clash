import { selectAdminMode } from "@/features/GlobalSlice";
import { initialMangaState } from "@/features/mangaHref/MangaSlice";
import { useEffect } from "react"
import { useState } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
const DynamicAdminDeleteManga = dynamic(() => import("./admin/admin-delete-manga"), {
  ssr: false,
})

export default function Name({ mangaState }: { mangaState: typeof initialMangaState[number] }) {
  const adminMode = useSelector(selectAdminMode)
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false)
  const [countdown, setCountdown] = useState<number>(5)
  // Thiết lập countdown 5s cho button xóa truyện
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
    <div className="space-x-1">
      <p className="text-xl md:text-2xl font-bold text-second-green dark:text-main-green inline">{mangaState.name}</p>
      {adminMode && (
        <DynamicAdminDeleteManga
          isOpenDeleteModal={isOpenDeleteModal}
          setIsOpenDeleteModal={setIsOpenDeleteModal}
          countdown={countdown}
          mangaState={mangaState}
        />
      )}
    </div>
  )
}