import { useSelector, useDispatch } from "react-redux"
import { selectSearchState, setSearchName } from "@/features/search/SearchSlice"
import SearchDropdown from "./SearchDropdown"
import { useEffect, useMemo, useRef, useState } from "react"
import { BarLoader } from "react-spinners"
import { useRouter } from "next/router"
import { Variants, motion } from "framer-motion"
import { useInterval } from 'usehooks-ts'

export default function SearchBox({
  showSearchBox,
  setShowSearchBox
}: {
  showSearchBox: boolean,
  setShowSearchBox: any
}) {
  const router = useRouter()
  const searchState = useSelector(selectSearchState)
  const dispatch = useDispatch()
  const [isLoadingMangas, setIsLoadingMangas] = useState<boolean>(false)
  const [strIndex, setStrIndex] = useState<number>(0)
  const myRef = useRef<HTMLDivElement>(null)
  // Style transition cho max height search box
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
  // Tạo interval để text tự động thay đổi luân hồi
  useInterval(() => {
    setStrIndex(prevState => {
      return prevState === str.length - 1 ? 0 : prevState + 1
    })
  }, 4000)

  const strVariants: Variants = useMemo(() => {
    return {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { staggerChildren: 0.06, duration: 0.4, delay: 0.4, delayChildren: 0.4, repeat: 1, repeatDelay: 2.8, repeatType: "reverse" } }
    }
  }, [])
  const charVariants: Variants = useMemo(() => {
    return {
      hidden: { opacity: 0, y: -4 },
      show: { opacity: 1, y: 0, transition: { duration: 0.04 } },
    }
  }, [])
  const str = useMemo(() => {
    return ["Bạn đang cần tìm truyện gì...?", "Nhập tên truyện bạn cần tìm...?"]
  }, [])

  return (
    <>
      <div
        ref={myRef}
        className={`w-full px-2 md:px-4 transition-all duration-400 overflow-hidden ${showSearchBox ? "py-2 md:py-4 opacity-100" : "py-0 opacity-0"}`}
      >
        <form className="relative flex flex-row justify-center mx-auto max-w-fit" onSubmit={(e) => {
          e.preventDefault()
          router.push(`/search?name=${searchState.name}`)
          setShowSearchBox(false)
        }}>
          <input
            id="search-box"
            name="search-box"
            className="px-4 text-sm py-3 md:py-3.5 w-[680px] focus:outline-none border bg-gray-100 border-neutral-300 dark:bg-neutral-700 dark:border-neutral-700"
            type="text"
            value={searchState.name}
            onChange={(e) => dispatch(setSearchName(e.target.value))}
            autoComplete="on"
          />
          <motion.label
            key={strIndex}
            htmlFor="search-box"
            className={`${searchState.name ? "hidden" : "block"} absolute text-sm -translate-y-1/2 left-4 top-1/2 text-neutral-400 cursor-text`}
            initial="hidden"
            animate={showSearchBox ? "show" : ""}
            variants={strVariants}
          >
            {str[strIndex].split("").map((char, i) => {
              return char !== " " ? <motion.span key={i} className="inline-block" variants={charVariants}>{char}</motion.span> : " "
            })}
          </motion.label>
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