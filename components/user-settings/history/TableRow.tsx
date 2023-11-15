import { mangasPerPage } from "@/type";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { MangaType } from "@/models/manga";
import { useRouter } from "next/router";
import { useState } from "react";
import { format, parseISO } from "date-fns";

export default function TableRow({ manga, createdAt, chapter }: { manga: MangaType, createdAt: string, chapter: string }) {
  return (
    <>
      <tr className={`relative border-b border-neutral-300`}>
        {/* image and name */}
        <td className={`flex flex-row p-4 pr-0 text-sm gap-x-4`}>
          <Image className="w-[69px] h-[100px]" src={manga.image.url} alt="" width={80} height={144} quality={0} />
          <Link
            href={`/manga/${manga.href}`}
            className="font-bold transition-colors cursor-pointer hover:text-second-green"
          >
            {manga.name}
          </Link>
        </td>
        {/* read chapters */}
        <td className="hidden py-3 space-y-2.5 text-sm sm:table-cell">
          <div className="flex flex-col items-center">
            <Link
              href={`/manga/${manga.href}/chapter-${chapter}`}
              className="px-2.5 py-1 text-sm font-bold text-gray-200 transition-colors bg-gray-100 rounded-lg hover:bg-main-green hover:text-white shrink-0"
            >
              Chapter {chapter}
            </Link>
          </div>
        </td>
        {/* delete button */}
        <td className="hidden sm:table-cell">
          <p className="text-sm text-center">{format(parseISO(createdAt as unknown as string), "HH:mm")}</p>
          <p className="text-sm text-center">{format(parseISO(createdAt as unknown as string), "dd/MM/yyyy")}</p>
        </td>
      </tr>
    </>
  )
}