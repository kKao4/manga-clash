import TableRow from "./table-row"
import Paginate from "@/components/global/paginate"
import { MangasResponse } from "@/type"
import { useState } from "react"
import { useRouter } from "next/router"
import { useDispatch, useSelector } from "react-redux"
import { selectBookmarkState, setSearchName } from "@/features/user-settings/BookmarkSlice"

const Bookmarks = ({ mangas, mangasLength }: { mangas: MangasResponse["data"], mangasLength: number }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const bookmarkState = useSelector(selectBookmarkState)
  return (
    <>
      {/* table bookmarked manga */}
      <form className="space-x-2 mb-2 float-right" onSubmit={async (e) => {
        e.preventDefault()
        router.push(`/user-settings?pageBookmark=1&name=${name}`)
      }}>
        <label>Tìm kiếm:</label>
        <input
          type="text"
          className="focus:outline-none px-2 py-1 border border-gray-300 rounded-md max-w-[180px]"
          value={bookmarkState.name}
          onChange={(e) => dispatch(setSearchName(e.target.value))}
        />
      </form>
      <table className="min-w-full mb-4 table-fixed">
        <thead>
          <tr className="bg-[#ebebeb]">
            <th className="w-7/12 px-4 py-2 font-bold text-left">Tên Truyện</th>
            <th className="hidden font-bold text-center sm:table-cell">Chapter</th>
            <th className="hidden font-bold text-center sm:table-cell">Xóa</th>
          </tr>
        </thead>
        <tbody>
          {mangas && mangas.length ? (
            <>
              {mangas.map(manga => {
                return <TableRow key={manga.href} manga={manga} mangasLength={mangasLength} />
              })}
            </>
          ) : (!router.query.name) ? (
            <tr>
              <td colSpan={3} className="py-4 font-medium text-center">Bạn chưa thích truyện nào</td>
            </tr>
          ) : (
            <tr>
              <td colSpan={3} className="py-4 font-medium text-center">Không có truyện nào khớp với tìm kiếm</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* paginate */}
      <div className="flex flex-row justify-center w-full">
        <Paginate mangasLength={mangasLength} page="bookmark" />
      </div>
    </>
  )
}

export default Bookmarks