import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { selectChartState, setPageChart, setSearchNameChart, setTimeChart } from "@/features/user-settings/ChartSlice";
import Paginate from "../../global/paginate/Paginate";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Chart() {
  const dispatch = useDispatch()
  const router = useRouter()
  const chartState = useSelector(selectChartState)
  useEffect(() => {
    if (router.query.pageChart) {
      dispatch(setPageChart(Number(router.query.pageChart)))
    } else {
      dispatch(setPageChart(1))
    }
  }, [router.query.pageChart, dispatch])
  useEffect(() => {
    if (router.query.nameChart) {
      dispatch(setSearchNameChart(router.query.nameChart as string))
    } else {
      dispatch(setSearchNameChart(""))
    }
  }, [router.query.nameChart, dispatch])
  useEffect(() => {
    if (router.query.time) {
      dispatch(setTimeChart(router.query.time as string))
    } else {
      dispatch(setTimeChart("oneWeek"))
    }
  }, [router.query.time, dispatch])
  useEffect(() => {
    if (chartState.mangas && chartState.mangas.length === 0) {
      if (router.query.pageChart && Number(router.query.pageChart) > 1) {
        router.replace(`/user-settings?time=${chartState.time}&pageChart=1&nameChart=${chartState.name}`)
      }
    }
  }, [router, chartState])
  return (
    <>
      <div className="flex flex-row mb-2">
        <select
          className="px-2 py-1 rounded-md focus:outline-none bg-gray-150 dark:bg-neutral-700"
          value={chartState.time}
          onChange={(e) => {
            dispatch(setTimeChart(e.target.value))
            router.push(`/user-settings?time=${e.target.value}&pageChart=1&nameChart=${chartState.name}`)
          }}>
          <option value="oneWeek">1 tuần</option>
          <option value="oneMonth">1 tháng</option>
          <option value="threeMonth">3 tháng</option>
          <option value="all">mọi lúc</option>
        </select>
        <form className="ml-auto space-x-2" onSubmit={async (e) => {
          e.preventDefault()
          router.push(`/user-settings?time=${chartState.time}&pageChart=1&nameChart=${chartState.name}`)
        }}>
          <label className="hidden sm:inline-block">Tìm kiếm:</label>
          <input
            type="text"
            className="focus:outline-none px-2 py-1 border border-gray-300 dark:border-transparent dark:bg-neutral-700 rounded-md max-w-[180px]"
            value={chartState.name}
            onChange={(e) => dispatch(setSearchNameChart(e.target.value))}
          />
        </form>
      </div>
      <table className="min-w-full mb-4 table-fixed">
        <thead>
          <tr className="bg-[#ebebeb] dark:bg-neutral-650">
            <th className="py-2 font-bold text-center">Hạng</th>
            <th className="w-8/12 font-bold text-center">Tên truyện</th>
            <th className="font-bold text-center">Lượt xem<p>({chartState.time === "oneWeek" ? "7 ngày" : chartState.time === "oneMonth" ? "30 ngày" : chartState.time === "threeMonth" ? "90 ngày" : "mọi lúc"})</p></th>
          </tr>
        </thead>
        <tbody>
          {chartState.mangas.map((manga) => {
            return (
              <tr key={manga.name + "-chart"} className="border-b border-neutral-300 dark:border-neutral-700">
                <td className="text-center align-top p-2.5">
                  <p>{manga.views.rank}</p>
                </td>
                {/* image and name */}
                <td className="flex flex-row p-2.5 pr-0 text-sm gap-x-4">
                  <Image className="w-[69px] h-[100px]" src={manga.image.url} alt="" width={80} height={144}
                    quality={0} />
                  <Link
                    href={`/manga/${manga.href}`}
                    className="font-bold transition-colors cursor-pointer hover:text-second-green dark:hover:text-third-green"
                  >
                    {manga.name}
                  </Link>
                </td>
                {/* delete button */}
                <td className="text-center align-top p-2.5">
                  {manga.views.value}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="flex flex-row justify-center w-full">
        <Paginate mangasLength={chartState.length} page="chart" />
      </div>
    </>
  )
}