import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { selectChartState, setSearchName, setTimeChart } from "@/features/user-settings/ChartSlice";
import Paginate from "../../global/paginate";
import { useRouter } from "next/router";

export default function Chart() {
  const dispatch = useDispatch()
  const router = useRouter()
  const chartState = useSelector(selectChartState)
  return (
    <>
      <div className="space-y-2">
        <div className="flex flex-row">
          <select
            className="px-2 py-1 rounded-md focus:outline-none bg-gray-150"
            value={chartState.time}
            onChange={(e) => {
              dispatch(setTimeChart(e.target.value))
              router.push(`/user-settings?time=${e.target.value}&pageChart=1&name=${chartState.name}`)
            }}>
            <option value="oneWeek">1 tuần</option>
            <option value="oneMonth">1 tháng</option>
            <option value="threeMonth">3 tháng</option>
            <option value="all">mọi lúc</option>
          </select>
          <form className="ml-auto space-x-2" onSubmit={async (e) => {
            e.preventDefault()
            router.push(`/user-settings?time=${chartState.time}&pageChart=1&name=${chartState.name}`)
          }}>
            <label className="sm:inline-block hidden">Tìm kiếm:</label>
            <input
              type="text"
              className="focus:outline-none px-2 py-1 border border-gray-300 rounded-md max-w-[180px]"
              value={chartState.name}
              onChange={(e) => dispatch(setSearchName(e.target.value))}
            />
          </form>
        </div>
        <table className="min-w-full mb-4 table-fixed">
          <thead>
            <tr className="bg-[#ebebeb]">
              <th className="py-2 font-bold text-center">Hạng</th>
              <th className="w-8/12 font-bold text-center">Tên truyện</th>
              <th className="font-bold text-center">Lượt xem<p>({chartState.time === "oneWeek" ? "7 ngày" : chartState.time === "oneMonth" ? "30 ngày" : chartState.time === "threeMonth" ? "90 ngày" : "mọi lúc"})</p></th>
            </tr>
          </thead>
          <tbody>
            {chartState.mangas.map((manga) => {
              return (
                <tr key={manga.href} className="border-b border-neutral-300">
                  <td className="text-center align-top p-2.5">
                    <p>{manga.views.rank}</p>
                  </td>
                  {/* image and name */}
                  <td className="flex flex-row p-2.5 pr-0 text-sm gap-x-4">
                    <Image className="w-[69px] h-[100px]" src={manga.image.url} alt="" width={80} height={144} />
                    <Link
                      href={`/manga/${manga.href}`}
                      className="font-bold transition-colors cursor-pointer hover:text-second-green"
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
      </div>
      <div className="flex flex-row justify-center w-full">
        <Paginate mangasLength={chartState.length} page="chart" />
      </div>
    </>
  )
}