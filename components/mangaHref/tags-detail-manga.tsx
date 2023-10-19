import { MangaResponse } from "@/type"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { resetSearchTags } from "@/features/search/SearchSlice"

export default function TagsDetailManga({ manga }: { manga: MangaResponse["data"] }) {
  const dispatch = useDispatch()
  return (
    <>
      {manga!.tags.length ? (
        <>
          {manga!.tags.map((tag, i, arr) => {
            if (i === arr.length - 1) {
              return (
                <Link
                  key={tag}
                  href={`/search?tags=${tag.toLowerCase()}`} className="font-semibold capitalize text-main-green"
                  onClick={() => dispatch(resetSearchTags())}
                >
                  {tag}
                </Link>
              )
            } else {
              return (
                <Link
                  key={tag}
                  href={`/search?tags=${tag.toLowerCase()}`}
                  onClick={() => dispatch(resetSearchTags())}
                >
                  <button
                    className="font-semibold capitalize text-main-green">
                    {tag}
                    <span className="text-black">,</span>
                  </button>{" "}
                </Link>
              )
            }
          })}
        </>
      ) : "Updating"}
    </>
  )
}