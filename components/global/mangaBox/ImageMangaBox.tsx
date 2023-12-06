import { MangaType } from "@/models/manga"
import Link from "next/link"
import Image from "next/image"
import { useMouse, useHover } from "@uidotdev/usehooks";
import { useRef } from "react"
import Parser from "html-react-parser"
import { Variants, motion } from "framer-motion";

export default function ImageMangaBox({ manga, width, height, showPeek = false }: { manga: MangaType, width: string, height: string, showPeek?: boolean }) {
  const [hoverRef, isHover] = useHover()
  const [mouse, mouseRef] = useMouse()
  // console.log(mouse.x + " / " + mouse.y)
  const popoverVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, transition: { duration: 0, delay: 0 } },
    show: { opacity: 1, scale: 1, transition: { duration: 0.8, type: "spring", bounce: 0.5 } }
  }
  return (
    <>
      <Link
        ref={hoverRef}
        href={`/manga/${manga.href}`}
        className={`relative ${height} ${showPeek ? "mt-1 md:mt-0.5" : "mt-0.5"} overflow-hidden cursor-pointer ${width} group/image flex-none peer`}
      >
        <div className="absolute top-0 left-0 z-10 w-full h-full transition-colors duration-500 bg-transparent group-hover/image:bg-black/20 dark:group-hover/image:bg-black/40" style={{ transitionTimingFunction: "ease" }}></div>
        {manga.image ? (
          <Image
            className="object-fill w-full h-full transition-transform duration-500 group-hover/image:scale-110"
            style={{ transitionTimingFunction: "ease" }}
            src={manga.image.url}
            alt={manga.name}
            fill={true}
            quality={0}
          />
        ) : (
          <div className={`${width} ${height} bg-neutral-200 animate-pulse`}></div>
        )}
      </Link>
      {showPeek && (
        <motion.div
          animate={isHover ? "show" : "hidden"}
          variants={popoverVariants}
          // transition={isHover ? { duration: 0.6, delay: 0.4, type: "spring", bounce: 0.4 } : undefined}
          // className="absolute w-[440px] bg-white rounded border-second-green border-2 z-30 shadow py-2 px-3.5"
          className={`absolute max-w-[420px] bg-white dark:bg-neutral-700 rounded-md border-second-green dark:border-black border-2 z-30 peer-hover:block hidden shadow py-2 px-3.5 pb-3`}
          style={{ left: mouse.x + 12 + "px", top: mouse.y + 12 + "px" }}
        >
          <p className="mb-2 font-bold leading-5 text-main-green text-[17px]">{manga.name}</p>
          <p className="mb-0.5 text-2sm">
            <span className="mr-1 font-semibold dark:font-bold">Thể loại:</span>
            {manga!.tags.length ? (
              <span>
                {manga!.tags.map((tag, i, arr) => {
                  if (i === arr.length - 1) {
                    return (
                      <span
                        key={tag}
                        className="capitalize"
                      >
                        {tag}
                      </span>
                    )
                  } else {
                    return (
                      <span
                        key={tag}
                        className="capitalize"
                      >
                        {tag},{" "}
                      </span>
                    )
                  }
                })}
              </span>
            ) : <span>Đang cập nhật</span>}
          </p>
          <p className="mb-0.5 text-2sm">
            <span className="mr-1 font-semibold dark:font-bold">Trạng thái:</span>
            <span>{manga?.completed ? "Hoàn thành" : "Đang tiến hành"}</span>
          </p>
          <p className="mb-1.5 text-2sm">
            <span className="mr-1 font-semibold dark:font-bold">Tác giả:</span>
            <span>{manga?.author ? manga.author : "Đang cập nhật"}</span>
          </p>
          <p className="text-sm">
            {/* <span className="mr-1 font-semibold dark:font-bold">Tóm tắt:</span> */}
            <span>{manga?.description ? Parser(manga?.description) : "Đang cập nhật"}</span>
          </p>
        </motion.div>
      )}
    </>
  )
}