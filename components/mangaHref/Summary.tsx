import { useSelector } from "react-redux"
import dynamic from "next/dynamic"
import Title from "../global/title/Title"
import { selectAdminMode } from "@/features/GlobalSlice"
import { Dispatch, SetStateAction, useRef, useState } from "react"
import Parser from "html-react-parser"
import ShowMore from "./ShowMoreButton"
import { initialMangaState } from "@/features/mangaHref/MangaSlice"
const DynamicAdminSummary = dynamic(() => import("./admin/admin-summary"), {
  ssr: false,
})

export default function Summary({ mangaState, description, setDescription }: { mangaState: typeof initialMangaState[number], description: string, setDescription: Dispatch<SetStateAction<string>> }) {
  const adminMode = useSelector(selectAdminMode)
  const [showMoreSummary, setShowMoreSummary] = useState<boolean>(false)
  const showMoreSummaryRef = useRef<HTMLDivElement>(null)
  return (
    <>
      <Title content="TÓM TẮT" order={false} />
      <div className="relative">
        {adminMode && (
          <DynamicAdminSummary mangaState={mangaState} description={description} setDescription={setDescription} />
        )}
        <div className={`${adminMode ? "invisible absolute" : "visible"}`}>
          <div
            ref={showMoreSummaryRef}
            className={`max-h-40 transition-all overflow-hidden duration-400 relative leading-7 whitespace-pre-line py-5 pb-3`}
          >
            {Parser(mangaState.description as string)}
            {showMoreSummaryRef.current && showMoreSummaryRef.current.scrollHeight > 160 && (
              <div className="absolute w-full h-6 bottom-0 bg-gradient-to-t from-white to-[rgba(255,255,255,0)] dark:from-dark-main-black dark:to-dark-main-black/0"></div>
            )}
          </div>
          {showMoreSummaryRef.current && showMoreSummaryRef.current.scrollHeight > 160 && (
            <ShowMore showMore={showMoreSummary} handleOnClick={() => {
              setShowMoreSummary(s => !s)
              if (showMoreSummaryRef.current && !showMoreSummary) {
                showMoreSummaryRef.current.style.maxHeight = showMoreSummaryRef.current.scrollHeight + "px"
              } else if (showMoreSummaryRef.current && showMoreSummary) {
                showMoreSummaryRef.current.style.maxHeight = "160px"
              }
            }} />
          )}
        </div>
      </div>
    </>
  )
}