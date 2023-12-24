import { MangaType } from "@/models/manga"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { setSort } from "@/features/GlobalSlice"
import Row from "./Row"
import { motion } from "framer-motion"

export default function MangasBoxesPopular({ mangas }: { mangas: MangaType[] | undefined }) {
  const dispatch = useDispatch()
  return (
    <div className="basis-4/12 ">
      <div className="px-5 w-fit py-1.5 bg-second-green font-bold tracking-wider text-sm text-white">Truyện Xem Nhiều</div>
      <div className="w-0 h-0 inline-block ml-4 border-[10px] border-x-transparent border-b-transparent border-t-second-green"></div>
      <div className="flex flex-col w-full gap-y-3 md:gap-y-4">
        {mangas ? (
          <>
            {mangas.map((manga, i) => {
              return <Row key={manga.name + "-popularMangas"} manga={manga} />
            })}
          </>
        ) : (
          <p>Không có bộ truyện nào</p>
        )}
      </div>
      <motion.div
        whileTap={{ scale: 0.95 }}
      >
        <Link
          href="/manga?page=1&sort=views"
          className="inline-block w-full py-1 mt-2 text-sm font-bold text-center text-white transition-colors md:mt-4 bg-second-green hover:bg-black"
          onClick={() => dispatch(setSort("views"))}
        >
          Xem thêm
        </Link>
      </motion.div>
    </div>
  )
}