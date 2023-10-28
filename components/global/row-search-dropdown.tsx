import { MangaType } from "@/models/manga"
import { formatDistanceToNowStrict, parseISO } from "date-fns"
import { vi } from "date-fns/locale"
import Image from "next/image"

export default function RowSearchDropdown({ manga }: { manga: MangaType }) {
  return (
    <div className="flex flex-row items-center px-2 py-2 transition-colors border-b border-gray-100 cursor-pointer md:px-3 gap-x-3 md:gap-x-4 group hover:bg-neutral-100">
      <Image src={`${manga.image.url}`} alt="" width={69} height={100} />
      <div className="flex flex-col gap-y-1">
        <p className="font-bold transition-colors group-hover:text-second-green line-clamp-2">{manga.name}{manga.name}{manga.name}{manga.name}{manga.name}{manga.name}</p>
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
        {/* TODO: tags */}
        <div className="text-xs md:text-sm">
          <span className="hidden font-semibold md:inline-block">Thể loại:</span> <span className="line-clamp-2">Harem, Comedy, Ecchi, Romance, Something, Something, Something Romance, Something, Something, Something</span>
        </div>
      </div>
    </div>
  )
}