import { format, parseISO, formatDistanceToNowStrict, formatDistanceToNow } from "date-fns"
import newGif from "@/assets/new.gif"
import Image from "next/image";
import { MangaType } from "@/models/manga";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectAdminMode } from "@/features/GlobalSlice";

export default function Chapter({
  chapter, mangaHref, readChapters, handleOnChange, checked
}: {
  chapter: MangaType["chapters"][number], mangaHref: string, readChapters: string[] | undefined, handleOnChange: () => void, checked: boolean
}) {
  const adminMode = useSelector(selectAdminMode)
  return (
    <label
      htmlFor={chapter.num}
      className={`relative rounded flex flex-row flex-wrap items-baseline col-span-3 px-2 py-5 border-b cursor-pointer sm:col-span-1 gap-x-2 gap-y-1 border-neutral-200 place-content-start sm:place-content-center`}
    >
      <Link
        href={`/manga/${mangaHref}/chapter-${chapter.num}`}
        className={`${readChapters && readChapters.includes(chapter.num.toString()) ? "text-neutral-400" : "text-black"} max-w-full overflow-hidden font-bold transition-colors line-clamp-2 text-center select-none hover:text-second-green`}
      >
        Chapter {chapter.num} {chapter.description && `- ${chapter.description}`}
      </Link>
      {adminMode && (
        <input
          type="checkbox"
          id={chapter.num}
          className=" w-3.5 h-3.5 absolute top-1 right-1"
          checked={checked}
          onChange={handleOnChange}
        />
      )}
      <div className="text-[13px] italic self-center shrink-0 min-w-fit">
        {Number(formatDistanceToNowStrict(parseISO(chapter.updatedAt as unknown as string), { unit: "day" }).split(" ")[0]) <= 2 ? (
          <p title={formatDistanceToNow(parseISO(chapter.updatedAt as unknown as string))}>
            <Image className="select-none" src={newGif} alt="new" />
          </p>
        ) : (
          <p className="text-[13px] italic">{format(parseISO(chapter.updatedAt as unknown as string), "MM/dd/yyyy")}</p>
        )}
      </div>
    </label>
  )
}