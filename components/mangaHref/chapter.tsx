import { parseISO, format } from "date-fns"
import { MangaType } from "@/models/manga";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectAdminMode } from "@/features/GlobalSlice";

export default function Chapter({
  chapter, mangaHref, readChapters, handleOnChange, checked
}: {
  chapter: MangaType["chapters"][number], mangaHref: string, readChapters: string[] | undefined, handleOnChange: () => void, checked: boolean
}) {
  const router = useRouter()
  const adminMode = useSelector(selectAdminMode)
  return (
    <div className="relative">
      <div
        className={`flex flex-row flex-wrap items-baseline col-span-3 px-2 py-5 border-b cursor-pointer sm:col-span-1 gap-x-2 gap-y-1 border-neutral-200 dark:border-neutral-700 place-content-start sm:place-content-center group`}
        onClick={() => router.push(`/manga/${mangaHref}/chapter-${chapter.num}`)}
      >
        <div
          className={`${readChapters && readChapters.includes(chapter.num.toString()) ? "text-neutral-400 dark:text-neutral-500" : "text-black dark:text-neutral-100"} max-w-full overflow-hidden font-bold transition-colors line-clamp-2 text-center select-none group-hover:text-second-green dark:group-hover:text-third-green`}
        >
          Chapter {chapter.num} {chapter.description && `- ${chapter.description}`}
        </div>

        <div className="text-[13px] italic self-center shrink-0 min-w-fit">
          <p className="text-[13px] italic">{format(parseISO(chapter.updatedAt as unknown as string), "dd/MM/yyyy")}</p>
        </div>
      </div>
      {adminMode && (
        <div className="absolute top-0 right-0 w-10 h-full flex justify-end items-start" onClick={handleOnChange}>
          <input
            type="checkbox"
            id={chapter.num}
            className="w-3.5 h-3.5 m-1.5 sm:m-1"
            checked={checked}
          />
        </div>
      )}
    </div>
  )
}