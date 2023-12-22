import { initialMangaState } from "@/features/mangaHref/MangaSlice";
import TextArea from "../TextArea";
import { Dispatch, SetStateAction } from "react";

export default function AdminSummary({
  mangaState, description, setDescription
}: {
  mangaState: typeof initialMangaState[number], description: string, setDescription: Dispatch<SetStateAction<string>>
}) {
  return (
    <div className="py-5">
      <TextArea mangaState={mangaState} description={description} setDescription={setDescription} />
    </div>
  )
}