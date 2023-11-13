import { setSearchName } from "@/features/search/SearchSlice"
import { MangaType } from "@/models/manga"
import { formatDistanceToNowStrict, parseISO } from "date-fns"
import { vi } from "date-fns/locale"
import Image from "next/image"
import { useRouter } from "next/router"
import { useDispatch } from "react-redux"

export default function RowSearchDropdown({ manga, setShowSearchBox }: { manga: MangaType, setShowSearchBox: any }) {
  const router = useRouter()
  const dispatch = useDispatch()
  return (
    <div
      className="flex flex-row items-start px-2 py-2 transition-colors border-b border-gray-100 cursor-pointer md:px-3 gap-x-3 md:gap-x-4 group hover:bg-neutral-100"
      onClick={() => {
        setShowSearchBox(false)
        dispatch(setSearchName(""))
        router.push(`/manga/${manga.href}`)
      }}
    >
      <div className="w-[69px] h-[100px] relative overflow-hidden">
        <Image src={`${manga.image.url}`} alt="" fill={true} className="object-cover" />
      </div>
      <div className="flex flex-col gap-y-1">
        <p className="font-bold transition-colors group-hover:text-second-green line-clamp-2">{manga.name}</p>
        <p className="hidden text-sm md:inline-block"><span className="font-semibold">Tên khác:</span> {manga.otherName ? `${manga.otherName}` : "Đang cập nhật"}</p>
        <div className="flex flex-row flex-wrap text-xs md:text-sm gap-x-1 sm:gap-x-2">
          <p><span className="hidden font-semibold md:inline-block">Trạng thái:</span> {manga.completed ? "Hoàn thành" : "Đang tiến hành"}</p>
          <div className="flex items-center justify-center">
            <svg className="h-1.5 fill-gray-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" /></svg>
          </div>
          <p><span className="hidden font-semibold md:inline-block">Chapter mới nhất:</span> {manga.chapters.length ? (
            <>
              Chapter {manga.chapters[0].num} - {formatDistanceToNowStrict(parseISO(manga.chapters[0].updatedAt as unknown as string), { locale: vi })}
            </>
          ) : (
            <>
              Chưa có chapter nào
            </>
          )}</p>
        </div>
        <div className="text-xs md:text-sm line-clamp-2">
          <span className="hidden font-semibold md:inline-block">Thể loại:</span>{" "}
          {manga.tags.map((tag, i, arr) => {
            if (i !== arr.length - 1) {
              return <span key={tag} className="capitalize">{tag}, </span>
            } else {
              return <span key={tag} className="capitalize">{tag}</span>
            }
          })}
        </div>
      </div>
    </div>
  )
}