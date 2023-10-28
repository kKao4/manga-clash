import { useSelector, useDispatch } from "react-redux"
import { selectSearchState, setSearchName } from "@/features/search/SearchSlice"
import { useRouter } from "next/router"
import SearchDropdown from "./search-dropdown"
import { useEffect, useState } from "react"
import { PulseLoader } from "react-spinners"

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
  const [isLoadingMangas, setIsLoadingMangas] = useState<boolean>(false)
  useEffect(() => {
    setIsLoadingMangas(() => searchState.name ? true : false)
  }, [searchState.name])
  return (
    <>
      <div className={`w-full px-4 transition-all duration-400 overflow-hidden ${showSearchBox ? "max-h-[82px] py-4 opacity-100" : "max-h-0 py-0 opacity-0"}`}>
        <form className="relative flex flex-row justify-center" onSubmit={(e) => {
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
          <button
            type="submit"
            className={`min-w-[114px] py-3.5 text-sm font-bold text-white ${isLoadingMangas ? "bg-[#357e6f]" : "bg-main-green hover:bg-black"} transition-colors shrink-0`}
            disabled={isLoadingMangas}
          >
            {isLoadingMangas ? (
              <>
                <PulseLoader color="#ffffff" size={9} />
              </>
            ) : "Tìm Kiếm"}
          </button>
        </form>
      </div>
      {/* search dropdown section */}
      <SearchDropdown setIsLoadingMangas={setIsLoadingMangas} />
    </>
  )
}