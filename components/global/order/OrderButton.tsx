import Link from "next/link"
import { useSelector } from "react-redux"
import { selectSort } from "@/features/GlobalSlice"
import { selectSearchState } from "@/features/search/SearchSlice"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { searchQueryFn } from "@/type"
import { useHover } from 'usehooks-ts'

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
  const hoverRef = useRef<any>(null)
  const isHover = useHover(hoverRef)
  useEffect(() => {
    let searchQuery = "";
    if (search) {
      searchQuery = searchQueryFn(searchState)
    } else {
      searchQuery = `&tags=${searchState.tags}`;
    }
    if (content === "Lượt xem") {
      setQuery(`page=1&sort=views&${searchQuery}`)
    } else if (content === "Mới cập nhật") {
      setQuery(`page=1&sort=latest&${searchQuery}`)
    } else if (content === "A-Z") {
      setQuery(`page=1&sort=a-z&${searchQuery}`)
    } else if (content === "Đánh giá") {
      setQuery(`page=1&sort=rating&${searchQuery}`)
    } else if (content === "Mới") {
      setQuery(`page=1&sort=new&${searchQuery}`)
    }
  }, [search, searchState, content])
  return (
    <Link
      ref={hoverRef}
      href={`/${search ? "search" : "manga"}/?${query}`}
      scroll={false}
      className={`${(content === "Lượt xem" && sort === "views") ||
        (content === "Mới cập nhật" && sort === "latest") ||
        (content === "A-Z" && sort === "a-z") ||
        (content === "Đánh giá" && sort === "rating") ||
        (content === "Mới" && sort === "new")
        ? "text-main-green dark:text-third-green" : "text-gray-text dark:text-neutral-400"
        } px-2.5 py-2.5 pb-2 sm:py-3 dark:hover:text-third-green hover:text-main-green border-b-[3px] my-0 rounded z-10 transition-colors border-transparent relative group`}
      onClick={handleOnClick}
    >
      {content}
      {(content === "Lượt xem" && sort === "views") ||
        (content === "Mới cập nhật" && sort === "latest") ||
        (content === "A-Z" && sort === "a-z") ||
        (content === "Đánh giá" && sort === "rating") ||
        (content === "Mới" && sort === "new") ? <motion.div layoutId="underline" transition={{ duration: 0.18 }} className="h-0.5 bg-main-green absolute -bottom-0.5 left-0 z-10 w-full" /> : null}
      {isHover && <motion.div transition={{ duration: 0.12 }} layoutId="hover-bg" className="absolute top-0 left-0 rounded w-full h-full bg-second-green/20 z-10" />}
    </Link>
  )
}