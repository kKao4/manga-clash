import Image from "next/image";
import Link from "next/link";
import { MangaType } from "@/models/manga";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";

export default function TableRow({ manga, createdAt, chapter }: { manga: MangaType, createdAt: string, chapter: string }) {
  return (
    <>
      <tr className={`relative border-b dark:border-neutral-700`}>
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
        {/* read chapters */}
        <td className="hidden py-3 space-y-2.5 text-sm sm:table-cell">
          <div className="flex flex-col items-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={`/manga/${manga.href}/chapter-${chapter}`}
                className="px-2.5 py-1.25 text-sm btn-chapter"
              >
                Chapter {chapter}
              </Link>
            </motion.button>
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