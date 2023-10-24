import Link from "next/link"
import { useSelector } from "react-redux"
import { selectSort } from "@/features/GlobalSlice"
import { selectSearchState } from "@/features/search/SearchSlice"
import { useEffect, useState } from "react"
import { OrderRipples } from "./button-ripple"
import { searchQueryFn } from "@/type"

export default function OrderButton({
  content,
  search,
  handleOnClick
}: {
  content: string,
  search: boolean,
  handleOnClick: () => void
}) {
  const sort = useSelector(selectSort)
  const searchState = useSelector(selectSearchState)
  const [query, setQuery] = useState<string>()
  useEffect(() => {
    let searchQuery = "";
    if (search) {
      searchQuery = searchQueryFn(searchState)
    }
    if (content === "Lượt Xem") {
      setQuery(`page=1&sort=views&${searchQuery}`)
    } else if (content === "Mới Cập Nhật") {
      setQuery(`page=1&sort=latest&${searchQuery}`)
    } else if (content === "A-Z") {
      setQuery(`page=1&sort=a-z&${searchQuery}`)
    } else if (content === "Đánh Giá") {
      setQuery(`page=1&sort=rating&${searchQuery}`)
    } else if (content === "Mới Nhất") {
      setQuery(`page=1&sort=new&${searchQuery}`)
    }
  }, [search, searchState, content])
  return (
    <OrderRipples>
      <Link
        href={`/${search ? "search" : "manga"}/?${query}`}
        scroll={false}
        className={`${(content === "Lượt Xem" && sort === "views") ||
          (content === "Mới Cập Nhật" && sort === "latest") ||
          (content === "A-Z" && sort === "a-z") ||
          (content === "Đánh Giá" && sort === "rating") ||
          (content === "Mới Nhất" && sort === "new")
          ? "text-second-green border-b-second-green" : "text-gray-text"
          } px-2.5 py-3 capitalize hover:text-second-green border-b-[3px] my-0 hover:border-b-second-green transition-colors border-transparent`}
        onClick={handleOnClick}
      >
        {content}
      </Link>
    </OrderRipples>
  )
}