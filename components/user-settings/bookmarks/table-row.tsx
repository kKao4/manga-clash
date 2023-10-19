import { HOST_URL, mangasPerPage } from "@/type";
import Image from "next/image";
import { parseISO, formatDistanceToNowStrict, formatDistanceToNow, format } from "date-fns"
import newGif from "@/assets/new.gif"
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { MangaType } from "@/models/manga";
import { useRouter } from "next/router";
import { selectBookmarkState, setMangasBookmark } from "@/features/user-settings/BookmarkSlice";

export default function TableRow({ manga, mangasLength }: { manga: MangaType, mangasLength: number }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const bookmarkState = useSelector(selectBookmarkState)
  return (
    <>
      <tr className="border-b border-neutral-300">
        {/* image and name */}
        <td className="flex flex-row p-4 pr-0 text-sm gap-x-4">
          <Image src={`/${manga.image}`} alt="" width={80} height={144} />
          <Link
            href={`/manga/${manga.href}`}
            className="font-bold transition-colors cursor-pointer hover:text-second-green"
          >
            {manga.name}
          </Link>
        </td>
        {/* 2 latest chapters */}
        <td className="hidden py-3 space-y-4 text-sm sm:table-cell">
          {manga.chapters[0] && (
            <div className="flex flex-col items-center gap-y-2">
              <Link
                href={`/manga/${manga.href}/chapter-${manga.chapters[0].num}`}
                className="px-2.5 py-1 text-sm font-bold text-gray-200 transition-colors bg-gray-100 rounded-lg hover:bg-main-green hover:text-white shrink-0"
              >
                Chapter {manga.chapters[0].num}
              </Link>
              {Number(formatDistanceToNowStrict(parseISO(manga.chapters[0].updatedAt as unknown as string), { unit: "day" }).split(" ")[0]) <= 2 ? (
                <p title={formatDistanceToNow(parseISO(manga.chapters[0].updatedAt as unknown as string))}>
                  <Image src={newGif} alt="new" />
                </p>
              ) : (
                <p className="text-sm">{format(parseISO(manga.chapters[0].updatedAt as unknown as string), "MM/dd/yyyy")}</p>
              )}
            </div>
          )}
          {manga.chapters[1] && (
            <div className="flex flex-col items-center gap-y-2"> {/* TODO: change hour to day */}
              <Link
                href={`/manga/${manga.href}/chapter-${manga.chapters[1].num}`}
                className="px-2.5 py-1 text-sm font-bold text-gray-200 transition-colors bg-gray-100 rounded-lg hover:bg-main-green hover:text-white shrink-0"
              >
                Chapter {manga.chapters[1].num}
              </Link>
              {Number(formatDistanceToNowStrict(parseISO(manga.chapters[1].updatedAt as unknown as string), { unit: "day" }).split(" ")[0]) <= 2 ? (
                <p title={formatDistanceToNow(parseISO(manga.chapters[1].updatedAt as unknown as string))}>
                  <Image src={newGif} alt="new" />
                </p>
              ) : (
                <p className="text-sm">{format(parseISO(manga.chapters[1].updatedAt as unknown as string), "MM/dd/yyyy")}</p>
              )}
            </div>
          )}
        </td>
        {/* delete button */}
        <td className="hidden sm:table-cell">
          <button
            className="flex flex-row px-3 py-1.5 mx-auto text-sm text-white bg-red-500 rounded"
            onClick={async () => {
              const result1 = await fetch(`${HOST_URL}/api/user/actions/bookmark/${manga.href}`);
              const res1 = await result1.json()
              console.log("🚀 ~ file: info-box.tsx:63 ~ onClick={ ~ res:", res1)
              if (bookmarkState.page > Math.ceil((mangasLength - 1) / mangasPerPage)) {
                router.replace(router.pathname + "?page=" + (bookmarkState.page - 1) + `${router.query.name ? `&name=${router.query.name}` : ""}`, "", { scroll: false, shallow: true })
                const mangasBookmarkResult = await fetch(`${HOST_URL}/api/user/all_mangas_bookmarks?sort=latest&pageBookmark=${bookmarkState.page - 1}&name=${bookmarkState.name}`)
                const mangasBookmarkRes = await mangasBookmarkResult.json()
                dispatch(setMangasBookmark({ mangas: mangasBookmarkRes.data, length: mangasBookmarkRes.length }))
              } else {
                // router.replace(router.asPath, "", { scroll: false })
                const mangasBookmarkResult = await fetch(`${HOST_URL}/api/user/all_mangas_bookmarks?sort=latest&pageBookmark=${bookmarkState.page}&name=${bookmarkState.name}`)
                const mangasBookmarkRes = await mangasBookmarkResult.json()
                dispatch(setMangasBookmark({ mangas: mangasBookmarkRes.data, length: mangasBookmarkRes.length }))
              }
            }}
          >
            <svg className="h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" /></svg>
          </button>
        </td>
      </tr>
    </>
  )
}