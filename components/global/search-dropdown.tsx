import { selectSearchState } from "@/features/search/SearchSlice"
import { MangaType } from "@/models/manga"
import { MangasResponse } from "@/type"
import * as React from "react";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useDebounce } from 'usehooks-ts'
import RowSearchDropdown from "./row-search-dropdown"

export default function SearchDropdown({ isLoadingMangas, setIsLoadingMangas }: { isLoadingMangas: boolean, setIsLoadingMangas: any }) {
  const searchState = useSelector(selectSearchState)
  const debounceSearchName = useDebounce<string>(searchState.name, 400)
  const [searchedMangas, setSearchedMangas] = useState<MangaType[]>()
  const [prevDebounceSearchName, setPrevDebounceSearchName] = useState<string>()
  // fetch searched mangas
  useEffect(() => {
    const fetchSearchedMangas = async () => {
      if (debounceSearchName && searchState.name && debounceSearchName !== prevDebounceSearchName) {
        setPrevDebounceSearchName(debounceSearchName)
        const result = await fetch(`api/all_mangas_dropdown?name=${debounceSearchName}`)
        const res: MangasResponse = await result.json()
        console.log("🚀 ~ file: search-dropdown.tsx:19 ~ fetchSearchedMangas ~ res:", res)
        if (res.message) {
          setSearchedMangas(res.data)
          // setIsLoadingMangas(false)
        } else if (res.error) {
          alert(res.error)
        }
        setIsLoadingMangas(false)
      }
    }
    fetchSearchedMangas()
  }, [debounceSearchName, searchState.name, setIsLoadingMangas, prevDebounceSearchName])
  // reset searched mangas
  useEffect(() => {
    if (!searchState.name) {
      setSearchedMangas(undefined)
    }
  }, [searchState.name])
  return (
    <div
      className={`${searchState.name ? "max-h-[480px]" : "max-h-0"} ${searchedMangas ? "border-2 border-b-0" : ""} z-50 absolute top-[68px] rounded-b-md shadow-lg transition-all w-[734px] left-1/2 -translate-x-1/2 bg-white overflow-auto scrollbar`}
    >
      {searchedMangas && searchedMangas.length ? (
        <>
          {searchedMangas.map((manga) => {
            return <RowSearchDropdown key={manga.href} manga={manga} />
          })}
        </>
      ) : searchedMangas && !searchedMangas.length ? (
        <p className="py-2 font-semibold text-center">Không tìm thấy bộ truyện phù hợp</p>
      ) : ""}
    </div>
  )
}