import { mangasPerPage } from "@/type";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { MangaType } from "@/models/manga";
import { useRouter } from "next/router";
import { selectBookmarkState, setMangasBookmark } from "@/features/user-settings/BookmarkSlice";
import { useState } from "react";
import RowChapter from "@/components/global/mangaBox/RowChapter";

export default function TableRow({ manga, mangasLength }: { manga: MangaType, mangasLength: number }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const bookmarkState = useSelector(selectBookmarkState)
  const [isRemovingBookmark, setIsRemovingBookmark] = useState<boolean>(false)
  return (
    <>
      <tr className={`relative border-b dark:border-neutral-700 ${isRemovingBookmark && "opacity-60"}`}>
        {/* image and name */}
        <td className={`flex flex-row p-4 pr-0 text-sm gap-x-4`}>
          <Image className="w-[69px] h-[100px]" src={manga.image.url} alt="" width={80} height={144} quality={0} />
          <Link
            href={`/manga/${manga.href}`}
            className="font-bold transition-colors cursor-pointer hover:text-second-green dark:hover:text-third-green"
          >
            {manga.name}
          </Link>
        </td>
        {/* 2 latest chapters */}
        <td className="hidden space-y-2.5 sm:table-cell">
          {manga.chapters.map((chapter, i) => {
            return <RowChapter key={manga.name + "-chapter"} manga={manga} i={i} paddingChapter="px-2.5 py-1.25" fontSize="text-sm" className="flex-col gap-y-1.25" />
          })}
        </td>
        {/* delete button */}
        <td className="hidden sm:table-cell">
          <button
            className="flex flex-row px-3 py-1.5 mx-auto text-sm text-white bg-red-500 rounded hover:bg-red-700 transition-colors"
            onClick={async () => {
              setIsRemovingBookmark(true)
              const result1 = await fetch(`/api/user/actions/bookmark/${manga.href}`);
              const res1 = await result1.json()
              console.log("🚀 ~ file: info-box.tsx:63 ~ onClick={ ~ res:", res1)
              if (bookmarkState.page > Math.ceil((mangasLength - 1) / mangasPerPage)) {
                router.replace(router.pathname + "?pageBookmark=" + (bookmarkState.page - 1) + `${router.query.nameBookmark ? `&nameBookmark=${router.query.nameBookmark}` : ""}`, "", { scroll: false, shallow: true })
                const mangasBookmarkResult = await fetch(`/api/user/all_mangas_bookmarks?sort=latest&pageBookmark=${bookmarkState.page - 1}&nameBookmark=${bookmarkState.name}`)
                const mangasBookmarkRes = await mangasBookmarkResult.json()
                dispatch(setMangasBookmark({ mangas: mangasBookmarkRes.data, length: mangasBookmarkRes.length }))
              } else {
                router.replace(router.pathname + "?pageBookmark=" + (bookmarkState.page) + `${router.query.nameBookmark ? `&nameBookmark=${router.query.nameBookmark}` : ""}`, "", { scroll: false, shallow: true })
                const mangasBookmarkResult = await fetch(`/api/user/all_mangas_bookmarks?sort=latest&pageBookmark=${bookmarkState.page}&nameBookmark=${bookmarkState.name}`)
                const mangasBookmarkRes = await mangasBookmarkResult.json()
                console.log("🚀 ~ file: table-row.tsx:90 ~ mangasBookmarkRes:", mangasBookmarkRes)
                dispatch(setMangasBookmark({ mangas: mangasBookmarkRes.data, length: mangasBookmarkRes.length }))
              }
              setIsRemovingBookmark(false)
            }}
          >
            <svg className="h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" /></svg>
          </button>
        </td>
      </tr>
    </>
  )
}