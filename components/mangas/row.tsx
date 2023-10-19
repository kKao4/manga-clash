import { MangaType } from "@/models/manga"
import MangaBox from "./manga-box"

export default function Row({ manga, index }: { manga: MangaType, index: number }) {
  return (
    <>
      <MangaBox manga={manga} />
      {index % 2 !== 0 && <hr className="hidden col-span-2 md:block" />}
    </>
  )
}