import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import { resetSearchTags } from "@/features/search/SearchSlice"
import { tagsArray } from "@/type"

export default function GenreButton({ tag }: { tag: typeof tagsArray[number] }) {
  const dispatch = useDispatch()
  return (
    <Link
      href={`/manga/?page=1&sort=latest&tags=${tag.id}`}
      className="col-span-1 py-2 font-bold text-center transition-colors cursor-pointer hover:text-second-green"
    >
      {tag.title}
    </Link>
  )
}