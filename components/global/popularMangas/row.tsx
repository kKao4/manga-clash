import { MangaType } from "@/models/manga"
import MangaBoxPopular from "./manga-box"

export default function Row({ manga }: { manga: MangaType }) {
  return (
    <>
      <MangaBoxPopular manga={manga} />
      <hr className="dark:border-neutral-700" />
    </>
  )
}