import { useRef, useState } from "react"
import MenuFootBox from "../global/box/MenuFootBox"
import { tagsArray } from "@/type"
import Navigation from "../global/navigation/Navigation"
import dynamic from "next/dynamic"
const DynamicGenreButton = dynamic(() => import("./GenreButton"))

export default function MenuFoot() {
  const myRef = useRef<HTMLDivElement>(null)
  const [showGenres, setShowGenres] = useState<boolean>(false)
  const handleCloseGenres = () => {
    setShowGenres(s => !s)
    if (myRef.current) {
      if (!showGenres) {
        myRef.current.style.maxHeight = myRef.current.scrollHeight + 34 + "px"
      } else {
        myRef.current.style.maxHeight = "0px"
      }
    }
  }
  return (
    <>
      <MenuFootBox>
        {/* information bar */}
        <Navigation />
        <div className="flex flex-row justify-between w-full">
          <div className="px-5 py-2 text-sm font-bold text-white w-fit bg-second-green">
            THỂ LOẠI
          </div>
          <button
            className="border-2 border-second-green px-2.5 group hover:border-black dark:hover:border-white transition-colors hover:bg-black"
            onClick={handleCloseGenres}
          >
            <svg className="h-4 transition-colors fill-second-green group-hover:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" /></svg>
          </button>
        </div>
        <div ref={myRef} className={`grid grid-cols-3 sm:grid-cols-6 relative transition-all duration-400 overflow-hidden max-h-0 ${showGenres ? "opacity-100 py-3" : "opacity-0 py-0"}`}>
          <div className={`absolute left-3 w-0 h-0 inline-block border-[10px] border-transparent border-t-second-green ${showGenres ? " block" : "hidden"}`}></div>
          {tagsArray.map(tag => {
            return <DynamicGenreButton key={tag.id} tag={tag} handleOnClick={handleCloseGenres} />
          })}
        </div>
      </MenuFootBox>
    </>
  )
}