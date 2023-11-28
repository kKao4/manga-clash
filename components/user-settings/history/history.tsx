import Paginate from "@/components/global/paginate/Paginate"
import { selectHistoryState, setPageHistory, setSearchNameHistory } from "@/features/user-settings/HistorySlice"
import { useRouter } from "next/router"
import { useSelector, useDispatch } from "react-redux"
import TableRow from "./TableRow"
import { useEffect } from "react"

export default function History() {
  const dispatch = useDispatch()
  const router = useRouter()
  const historyState = useSelector(selectHistoryState)
  useEffect(() => {
    if (router.query.pageHistory) {
      dispatch(setPageHistory(Number(router.query.pageHistory)))
    } else {
      dispatch(setPageHistory(1))
    }
  }, [dispatch, router.query.pageHistory])
  useEffect(() => {
    if (router.query.nameHistory) {
      dispatch(setSearchNameHistory(router.query.nameHistory as string))
    } else {
      dispatch(setSearchNameHistory(""))
    }
  }, [dispatch, router.query.nameHistory])
  return (
    <>
      {/* table history mangas */}
      <form
        className="float-right mb-2 space-x-2"
        onSubmit={async (e) => {
          e.preventDefault()
          router.push(`/user-settings?pageHistory=1&nameHistory=${historyState.name}`)
        }}
      >
        <label>Tìm kiếm:</label>
        <input
          type="text"
          className="focus:outline-none px-2 py-1 border border-gray-300 rounded-md max-w-[180px]"
          value={historyState.name}
          onChange={(e) => dispatch(setSearchNameHistory(e.target.value))}
        />
      </form>
      <table className="min-w-full mb-4 table-fixed">
        <thead>
          <tr className="bg-[#ebebeb]">
            <th className="w-6/12 px-4 py-2 font-bold text-left">Tên Truyện</th>
            <th className="hidden font-bold text-center sm:table-cell">Chapter</th>
            <th className="hidden font-bold text-center sm:table-cell">Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {historyState.mangas && historyState.length ? (
            <>
              {historyState.mangas.map(manga => {
                return <TableRow key={manga.manga.name + "-history"} manga={manga.manga} createdAt={manga.createdAt} chapter={manga.chapter} />
              })}
            </>
          ) : (!router.query.nameHistory) ? (
            <tr>
              <td colSpan={3} className="py-4 font-medium text-center">Bạn chưa đọc truyện nào</td>
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
        <Paginate mangasLength={historyState.length} page="history" />
      </div>
    </>
  )
}