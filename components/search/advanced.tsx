import { tagsArray } from "@/type";
import Input from "./input";
import Checkbox from "./checkbox";
import { MyRipples } from "../global/button-ripple";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, SetStateAction, Dispatch } from "react"
import { selectSort } from "@/features/GlobalSlice";
import { selectSearchState, setSearchAuthor, setSearchCompleted, resetSearch } from "@/features/search/SearchSlice";
import { useRouter } from "next/router";
import Radio from "./radio";


export default function Advanced({ setSearched }: { setSearched: Dispatch<SetStateAction<boolean>> }) {
  const dispatch = useDispatch()
  const sort = useSelector(selectSort)
  const searchState = useSelector(selectSearchState)
  const [query, setQuery] = useState<string>()
  const router = useRouter()
  useEffect(() => {
    let searchQuery = "";
    searchQuery = `name=${searchState.name}&author=${searchState.author}&completed=${searchState.completed}`
    if (searchState.tags.length) {
      searchState.tags.forEach(tag => {
        searchQuery += `&tags=${tag}`
      })
    }
    setQuery(`page=1&sort=${sort.toLowerCase()}&${searchQuery}`)
  }, [sort, searchState])
  return (
    <div className="py-3">
      <form onSubmit={async (e) => {
        e.preventDefault()
        router.push(`/search?${query}`, "", { scroll: false })
        setSearched(true)
      }}>
        <div className="grid grid-cols-2 mb-2 sm:mb-4 sm:grid-cols-3 md:grid-cols-6 gap-y-4">
          {tagsArray.map(tag => {
            return <Checkbox key={tag.id} content={tag.title} />
          })}
        </div>
        <Input content="Tác giả" value={searchState.author} handleOnChange={(value) => dispatch(setSearchAuthor(value))} />
        {/* <Input content="Năm phát hành" value={searchState.year} handleOnChange={(value) => dispatch(setSearchYear(value))} /> */}
        <div className="flex flex-row items-center w-full py-3 sm:w-5/6 lg:w-2/3">
          <p className="font-bold basis-1/3">Trạng thái</p>
          <div className="flex flex-row flex-wrap w-full gap-x-4 sm:gap-x-12">
            <Radio content="Đang tiến hành" checked={searchState.completed === "false"} handleOnChange={() => dispatch(setSearchCompleted("false"))} />
            <Radio content="Hoàn thành" checked={searchState.completed === "true"} handleOnChange={() => dispatch(setSearchCompleted("true"))} />
            <Radio content="Cả hai" checked={searchState.completed === ""} handleOnChange={() => dispatch(setSearchCompleted(""))} />
          </div>
        </div>
        <div className="flex flex-row items-center justify-center py-2 gap-x-6">
          <MyRipples>
            <button
              className="py-3 font-bold text-white transition-colors rounded px-9 hover:bg-black bg-second-green"
              type="submit"
            >
              Tìm Kiếm
            </button>
          </MyRipples>
          <MyRipples>
            <button
              type="button"
              className="px-4 py-1 font-bold transition-colors bg-transparent border-[3px] rounded-full border-second-green hover:text-white text-second-green hover:bg-black hover:border-black"
              onClick={() => {
                dispatch(resetSearch())
                router.push("/search")
              }}
            >
              Đặt lại
            </button>
          </MyRipples>
        </div>
      </form>
    </div>
  )
}