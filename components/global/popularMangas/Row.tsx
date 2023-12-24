import { MangaType } from "@/models/manga"
import MangaBoxPopular from "./MangaBox"

export default function Row({ manga }: { manga: MangaType }) {
  return (
    <>
      <MangaBoxPopular manga={manga} />
      <hr className="dark:border-neutral-700" />
    </>
  )
}