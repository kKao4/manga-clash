import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import { selectSort } from "@/features/GlobalSlice"
import { resetSearchTags } from "@/features/search/SearchSlice"
import { tagsArray } from "@/type"

export default function GenreButton({ tag }: { tag: typeof tagsArray[number] }) {
  const sort = useSelector(selectSort)
  const dispatch = useDispatch()
  return (
    <Link
      href={`/search/?page=1&sort=${sort}&tags=${tag.id}`}
      className="col-span-1 py-2 font-bold text-center transition-colors cursor-pointer hover:text-second-green"
      onClick={() => dispatch(resetSearchTags())}
    >
      {tag.title}
    </Link>
  )
}