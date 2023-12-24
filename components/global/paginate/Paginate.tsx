import { useMemo, useState } from "react";
import ReactPaginate from "react-paginate"
import { useSelector } from "react-redux"
import { selectSort } from "@/features/GlobalSlice";
import { useRouter } from "next/router";
import { mangasPerPage, searchQueryFn } from "@/type";
import { selectBookmarkState } from "@/features/user-settings/BookmarkSlice";
import { selectSearchState } from "@/features/search/SearchSlice";
import { selectChartState } from "@/features/user-settings/ChartSlice";
import { selectMangasState } from "@/features/manga/MangasSlice";
import { selectHistoryState } from "@/features/user-settings/HistorySlice";

export default function Paginate({ mangasLength, page }: { mangasLength: number, page: "manga" | "bookmark" | "search" | "chart" | "history" }) {
  const router = useRouter();
  const mangasState = useSelector(selectMangasState)
  const sortState = useSelector(selectSort);
  const chartState = useSelector(selectChartState)
  const bookmarkState = useSelector(selectBookmarkState)
  const historyState = useSelector(selectHistoryState)
  const searchState = useSelector(selectSearchState)
  const [itemOffset, setItemOffset] = useState<number>(0);
  const endOffset = itemOffset + mangasPerPage;
  // const currentItems = mangas.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(mangasLength / mangasPerPage);
  // console.log("🚀 ~ file: paginate.tsx:12 ~ Paginate ~ pageSearch:", pageSearch)
  // console.log("🚀 ~ file: paginate.tsx:20 ~ Paginate ~ pageCount:", pageCount)
  const chevronRight = <svg className="h-3.5 inline-block mb-1 fill-gray-200 group-hover:fill-white dark:fill-neutral-100 dark:hover:fill-neutral-100 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" /></svg>
  const chevronLeft = <svg className="h-3.5 inline-block mb-1 fill-gray-200 group-hover:fill-white dark:fill-neutral-100 dark:hover:fill-neutral-300 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg>
  const forcePage = useMemo(() => {
    if (page === "manga") {
      return mangasState.page - 1
    } else if (page === "bookmark") {
      return bookmarkState.page - 1
    } else if (page === "search") {
      return searchState.page - 1
    } else if (page === "chart") {
      return chartState.page - 1
    } else if (page === "history") {
      return historyState.page - 1
    }
  }, [mangasState, bookmarkState, searchState, chartState, historyState, page])
  const href = (index: number) => {
    if (page === "manga") {
      return `/manga?page=${index}&sort=${sortState.toLowerCase()}&tags=${searchState.tags}`
    } else if (page === "bookmark") {
      return `/user-settings?pageBookmark=${index}&nameBookmark=${bookmarkState.name}`
    } else if (page === "search") {
      const searchQuery = searchQueryFn(searchState)
      return `/search?page=${index}&sort=${sortState.toLowerCase()}&${searchQuery}`;
    } else if (page === "chart") {
      return `/user-settings?time=${chartState.time}&pageChart=${index}&nameChart=${chartState.name}`
    } else if (page === "history") {
      return `/user-settings?pageHistory=${index}&nameHistory=${historyState.name}`
    } else {
      return "/"
    }
  }
  const handlePageClick = (event: { selected: number; }) => {
    const newOffset = (event.selected * mangasPerPage) % mangasLength;
    setItemOffset(newOffset);
    router.push(href(event.selected + 1))
  };
  return (
    <ReactPaginate
      className="flex flex-row mt-4 gap-x-1"
      breakLabel="..."
      nextLabel={chevronRight}
      onPageChange={handlePageClick}
      pageRangeDisplayed={3}
      marginPagesDisplayed={2}
      pageCount={pageCount}
      forcePage={forcePage}
      previousLabel={chevronLeft}
      renderOnZeroPageCount={null}
      activeLinkClassName="active-page"
      previousLinkClassName="bg-gray-150 dark:bg-transparent dark:hover:bg-neutral-700 font-bold px-3.5 py-2 cursor-pointer select-none hover:bg-main-green hover:text-white transition-colors group"
      nextLinkClassName="bg-gray-150 dark:bg-transparent dark:hover:bg-neutral-700 font-bold px-3.5 py-2 cursor-pointer select-none hover:bg-main-green hover:text-white group transition-colors h-fit"
      breakLinkClassName="bg-gray-150 text-gray-200 dark:bg-transparent dark:text-neutral-100 font-bold px-3.5 py-2 cursor-pointer select-none hover:bg-main-green hover:text-white transition-colors"
      pageLinkClassName="text-gray-200 dark:text-neutral-100 dark:hover:bg-neutral-700 font-bold px-3.5 py-2 cursor-pointer select-none hover:bg-main-green hover:text-white transition-colors"
    />
  )
}