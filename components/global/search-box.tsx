import { useSelector, useDispatch } from "react-redux"
import { selectSearchState, setSearchName } from "@/features/search/SearchSlice"
import SearchDropdown from "./search-dropdown"
import { useState } from "react"
import { PulseLoader } from "react-spinners"

export default function SearchBox({
  showSearchBox,
  setShowSearchBox
}: {
  showSearchBox: boolean,
  setShowSearchBox: any
}) {
  const searchState = useSelector(selectSearchState)
  const dispatch = useDispatch()
  const [isLoadingMangas, setIsLoadingMangas] = useState<boolean>(false)
  return (
    <>
      <div className={`w-full px-2 md:px-4 transition-all duration-400 overflow-hidden ${showSearchBox ? "max-h-[82px] py-2 md:py-4 opacity-100" : "max-h-0 py-0 opacity-0"}`}>
        <form className="relative flex flex-row justify-center" onSubmit={(e) => {
          e.preventDefault()
        }}>
          <input
            name="search-box"
            className="px-4 text-sm py-3 md:py-3.5 w-[680px] focus:outline-none border bg-gray-100 border-neutral-300" placeholder="Tên truyện cần tìm..."
            type="text"
            value={searchState.name}
            onChange={(e) => dispatch(setSearchName(e.target.value))}
            autoComplete="on"
          />
        </form>
      </div>
      {/* search dropdown section */}
      {showSearchBox && (
        <SearchDropdown setIsLoadingMangas={setIsLoadingMangas} setShowSearchBox={setShowSearchBox} />
      )}
    </>
  )
}