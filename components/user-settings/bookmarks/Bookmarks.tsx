import TableRow from "./TableRow"
import Paginate from "@/components/global/paginate/Paginate"
import { MangasResponse } from "@/type"
import { useRouter } from "next/router"
import { useDispatch, useSelector } from "react-redux"
import { selectBookmarkState, setPageBookmark, setSearchNameBookmark } from "@/features/user-settings/BookmarkSlice"
import { useEffect } from "react"
import { AnimatePresence } from "framer-motion"

const Bookmarks = ({ mangas, mangasLength }: { mangas: MangasResponse["data"], mangasLength: number }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const bookmarkState = useSelector(selectBookmarkState)
  useEffect(() => {
    if (router.query.pageBookmark) {
      dispatch(setPageBookmark(Number(router.query.pageBookmark)))
    } else {
      dispatch(setPageBookmark(1))
    }
  }, [router.query.pageBookmark, dispatch])
  useEffect(() => {
    if (router.query.nameBookmark) {
      dispatch(setSearchNameBookmark(router.query.nameBookmark as string))
    } else {
      dispatch(setSearchNameBookmark(""))
    }
  }, [router.query.nameBookmark, dispatch])
  useEffect(() => {
    if (mangas && mangas.length === 0) {
      if (router.query.pageBookmark && Number(router.query.pageBookmark) > 1) {
        router.replace(`/user-settings?pageBookmark=1&nameBookmark=${bookmarkState.name}`)
      }
    }
  }, [mangas, router, bookmarkState.name])
  return (
    <>
      {/* table bookmarked manga */}
      <form className="float-right mb-2 space-x-2" onSubmit={async (e) => {
        e.preventDefault()
        router.push(`/user-settings?pageBookmark=1&nameBookmark=${bookmarkState.name}`)
      }}>
        <label>Tìm kiếm:</label>
        <input
          type="text"
          className="focus:outline-none px-2 py-1 border border-gray-300 dark:border-transparent dark:bg-neutral-700 rounded-md max-w-[180px]"
          value={bookmarkState.name}
          onChange={(e) => dispatch(setSearchNameBookmark(e.target.value))}
        />
      </form>
      <table className="min-w-full mb-4 table-fixed">
        <thead>
          <tr className="bg-[#ebebeb] dark:bg-neutral-650">
            <th className="w-7/12 px-4 py-2 font-bold text-left">Tên Truyện</th>
            <th className="hidden font-bold text-center sm:table-cell">Chapter</th>
            <th className="hidden font-bold text-center sm:table-cell">Xóa</th>
          </tr>
        </thead>
        <tbody>
          {mangas && mangas.length ? (
            <AnimatePresence>
              {mangas.map(manga => {
                return <TableRow key={manga.name + "-bookmarks"} manga={manga} mangasLength={mangasLength} />
              })}
            </AnimatePresence>
          ) : (!router.query.nameBookmark) ? (
            <tr>
              <td colSpan={3} className="py-4 font-medium text-center">Bạn chưa theo dõi truyện nào</td>
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