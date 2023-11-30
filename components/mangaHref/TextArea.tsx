import { initialMangaState } from "@/features/mangaHref/MangaSlice"
import { Dispatch, SetStateAction, useEffect } from "react"

export default function TextArea({ mangaState, description, setDescription }: { mangaState?: typeof initialMangaState[number], description: string, setDescription: Dispatch<SetStateAction<string>> }) {
  // set description of manga
  useEffect(() => {
    if (mangaState) {
      setDescription(mangaState.description)
    }
  }, [mangaState, setDescription])
  return (
    <div>
      <div className="pt-1.5 pb-1 px-2 space-x-1 border border-b-transparent border-neutral-400 dark:border-transparent dark:bg-neutral-700 rounded-t">
        <button
          type="button"
          className="min-w-[28px] py-0.5 font-bold rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-600"
          title="bold"
          onClick={() => setDescription(prevDescription => prevDescription + "<b></b>")}
        >
          B
        </button>
        <button
          type="button"
          className="min-w-[28px] py-0.5 font-serif italic font-bold rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-600"
          title="italic"
          onClick={() => setDescription(prevDescription => prevDescription + "<i></i>")}
        >
          I
        </button>
        <button
          type="button"
          className="min-w-[28px] py-0.5 font-bold underline rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-600"
          title="underline"
          onClick={() => setDescription(prevDescription => prevDescription + "<u></u>")}
        >
          U
        </button>
      </div>
      <textarea
        name="description"
        className={`w-full px-3 border border-neutral-400 dark:border-transparent dark:bg-neutral-700 border-t-transparent rounded-b focus:outline-none min-h-[240px] mt-0`}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
  )
}