import { MangaType } from "@/models/manga"
import Paginate from "../global/paginate/Paginate"
import Row from "./Row"

export default function MangaBoxes({ mangas, mangasLength }: { mangas: MangaType[] | undefined, mangasLength: number | undefined }) {
  return (
    <div className="w-full py-6 md:py-8">
      <div className="grid grid-cols-2 gap-4 mb-4 md:gap-8">
        {mangas ? (
          <>
            {mangas.map((manga, i) => {
              return <Row key={manga.name + "-manga"} manga={manga} index={i} />
            })}
          </>
        ) : (
          <p className="text-center col-span-full">Không có bộ truyện nào khớp với yêu cầu tìm kiếm, vui lòng thử lại</p>
        )}
      </div>
      <div className="flex justify-center">
        {/* paginate */}
        {mangasLength ? (
          <Paginate mangasLength={mangasLength} page="manga" />
        ) : ""}
      </div>
    </div>
  )
}