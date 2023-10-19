import { useSelector, useDispatch } from "react-redux"
import { selectSearchState, setSearchName } from "@/features/search/SearchSlice"
import { useRouter } from "next/router"

export default function SearchBox({
  showSearchBox,
  closeSearchBox
}: {
  showSearchBox: boolean,
  closeSearchBox: () => void
}) {
  const searchState = useSelector(selectSearchState)
  const dispatch = useDispatch()
  const router = useRouter()
  return (
    <div className={`w-full px-4 transition-all duration-400 overflow-hidden ${showSearchBox ? "max-h-[100px] py-6 opacity-100" : "max-h-0 py-0 opacity-0"}`}>
      <form className="flex flex-row justify-center" onSubmit={(e) => {
        e.preventDefault()
        closeSearchBox()
        router.push(`/search?page=1&sort=latest&name=${searchState.name}`)
      }}>
        <input
          name="search-box"
          className="px-4 text-sm py-3.5 w-[620px] focus:outline-none border bg-gray-100 border-neutral-300" placeholder="Tên truyện cần tìm..."
          type="text"
          value={searchState.name}
          onChange={(e) => dispatch(setSearchName(e.target.value))}
          autoComplete="on"
        />
        <button className="px-6 py-3.5 text-sm font-bold text-white bg-main-green hover:bg-black transition-colors" type="submit">Tìm Kiếm</button>
      </form>
    </div>
  )
}