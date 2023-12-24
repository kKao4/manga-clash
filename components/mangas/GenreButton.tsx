import Link from "next/link"
import { tagsArray } from "@/type"

export default function GenreButton({ tag, handleOnClick }: { tag: typeof tagsArray[number], handleOnClick: () => void }) {
  return (
    <Link
      href={`/manga/?page=1&sort=latest&tags=${tag.id}`}
      className="col-span-1 py-2 font-bold text-center transition-colors cursor-pointer hover:text-second-green dark:hover:text-third-green"
      onClick={handleOnClick}
    >
      {tag.title}
    </Link>
  )
}