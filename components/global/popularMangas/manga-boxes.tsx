import { MangaType } from "@/models/manga"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { setSort } from "@/features/GlobalSlice"
import Row from "./row"

export default function MangasBoxesPopular({ mangas }: { mangas: MangaType[] | null }) {
  const dispatch = useDispatch()
  return (
    <div className="basis-4/12">
      <div className="px-5 w-fit py-1.5 bg-second-green font-bold tracking-wider text-sm text-white mt-1">Truyện Xem Nhiều</div>
      <div className="w-0 h-0 inline-block ml-4 border-[10px] border-x-transparent border-b-transparent border-t-second-green"></div>
      <div className="flex flex-col w-full gap-y-5">
        {mangas ? (
          <>
            {mangas.map(manga => {
              return <Row key={manga.href} manga={manga} />
            })}
          </>
        ) : (
          <p>Không có bộ truyện nào</p>
        )}
      </div>
      <Link
        href="/manga?page=1&sort=views"
        className="inline-block w-full py-1 mt-4 text-sm font-bold text-center text-white transition-colors bg-second-green hover:bg-black"
        onClick={() => dispatch(setSort("views"))}
      >
        Xem thêm
      </Link>
    </div>
  )
}