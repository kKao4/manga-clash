import { initialMangaState } from "@/features/mangaHref/MangaSlice";
import TextArea from "../TextArea";

export default function AdminSummary({
  mangaState, description, setDescription
}: {
  mangaState: typeof initialMangaState[number], description: string, setDescription: any
}) {
  return (
    <div className="py-5">
      <TextArea mangaState={mangaState} description={description} setDescription={setDescription} />
    </div>
  )
}