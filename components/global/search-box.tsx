import { useSelector, useDispatch } from "react-redux"
import { selectSearchState, setSearchName } from "@/features/search/SearchSlice"
import SearchDropdown from "./search-dropdown"
import { useEffect, useRef, useState } from "react"
import { BarLoader } from "react-spinners"

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
  const myRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (myRef.current) {
      if (showSearchBox) {
        let padding = window.innerWidth > 768 ? 32 : 16
        myRef.current.style.maxHeight = myRef.current.scrollHeight + padding + "px"
      } else {
        myRef.current.style.maxHeight = "0px"
      }
    }
  }, [showSearchBox])
  return (
    <>
      <div
        ref={myRef}
        className={`w-full px-2 md:px-4 transition-all duration-400 overflow-hidden ${showSearchBox ? "py-2 md:py-4 opacity-100" : "py-0 opacity-0"}`}
      >
        <form className="relative flex flex-row justify-center max-w-fit mx-auto" onSubmit={(e) => {
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
          {isLoadingMangas && (
            <div className="absolute bottom-0">
              <BarLoader height={3} width={680} color="#409a88" />
            </div>
          )}
        </form>
      </div>
      {/* search dropdown section */}
      {showSearchBox && (
        <SearchDropdown setIsLoadingMangas={setIsLoadingMangas} setShowSearchBox={setShowSearchBox} />
      )}
    </>
  )
}