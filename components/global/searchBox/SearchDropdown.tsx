import { selectSearchState } from "@/features/search/SearchSlice"
import { MangaType } from "@/models/manga"
import { MangasResponse } from "@/type"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useDebounce } from 'usehooks-ts'
import RowSearchDropdown from "./RowSearchDropdown"

export default function SearchDropdown({ setIsLoadingMangas, setShowSearchBox }: { setIsLoadingMangas: Dispatch<SetStateAction<boolean>>, setShowSearchBox: Dispatch<SetStateAction<boolean>> }) {
  const searchState = useSelector(selectSearchState)
  const debounceSearchName = useDebounce<string>(searchState.name, 400)
  const [searchedMangas, setSearchedMangas] = useState<MangaType[]>()
  // Fetch API cho tìm kiếm
  useEffect(() => {
    const fetchSearchedMangas = async () => {
      if (debounceSearchName) {
        setIsLoadingMangas(true)
        const result = await fetch(`/api/all_mangas_dropdown?name=${debounceSearchName}`)
        const res: MangasResponse = await result.json()
        console.log("🚀 ~ file: search-dropdown.tsx:19 ~ fetchSearchedMangas ~ res:", res)
        if (res.message) {
          setSearchedMangas(res.data)
        } else if (res.error) {
          alert(res.error)
        }
        setIsLoadingMangas(false)
      }
    }
    fetchSearchedMangas()
  }, [debounceSearchName, setIsLoadingMangas])
  // Tự động xóa kết quả tìm kiếm khi xóa hết text trong input
  useEffect(() => {
    if (!searchState.name) {
      setSearchedMangas(undefined)
    }
  }, [searchState.name])
  return (
    <div
      className={`${searchState.name ? "max-h-[480px]" : "max-h-0"} ${searchedMangas ? "border-2 border-b-0" : ""} z-50 absolute top-[58px] md:top-[68px] rounded-b-md shadow-lg transition-all w-full md:w-[680px] left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-700 dark:border-neutral-700 overflow-auto scrollbar`}
    >
      {searchedMangas && searchedMangas.length ? (
        <>
          {searchedMangas.map((manga) => {
            return <RowSearchDropdown key={manga.name + "-search"} manga={manga} setShowSearchBox={setShowSearchBox} />
          })}
        </>
      ) : searchedMangas && !searchedMangas.length ? (
        <p className="py-2 font-semibold text-center">Không tìm thấy bộ truyện phù hợp</p>
      ) : ""}
    </div>
  )
}