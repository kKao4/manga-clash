import { MangaType } from "@/models/manga"
import Paginate from "../global/paginate"
import Row from "./row"

export default function MangaBoxes({ mangas, mangasLength }: { mangas: MangaType[] | undefined, mangasLength: number | undefined }) {
  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-2 gap-8 mb-4">
        {mangas ? (
          <>
            {mangas.map((manga, i) => {
              return <Row key={manga.href} manga={manga} index={i} />
            })}
          </>
        ) : (
          <p className="text-center col-span-full">Không có bộ truyện nào khớp với yêu cầu tìm kiếm, vui lòng thử lại</p>
        )}
      </div>
      <div className="flex justify-center">
        {mangasLength ? (
          <Paginate mangasLength={mangasLength} page="manga" />
        ) : ""}
      </div>
    </div>
  )
}