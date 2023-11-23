import { MangaResponse } from "@/type"
import Link from "next/link"

export default function TagsDetailManga({ manga }: { manga: MangaResponse["data"] }) {
  return (
    <>
      {manga!.tags.length ? (
        <>
          {manga!.tags.map((tag, i, arr) => {
            if (i === arr.length - 1) {
              return (
                <Link
                  key={tag}
                  href={`/manga?page=1&sort=latest&tags=${tag.toLowerCase()}`} className="font-semibold capitalize text-main-green"
                >
                  {tag}
                </Link>
              )
            } else {
              return (
                <Link
                  key={tag}
                  href={`/manga?page=1&sort=latest&tags=${tag.toLowerCase()}`}
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
      ) : "Đang cập nhật"}
    </>
  )
}