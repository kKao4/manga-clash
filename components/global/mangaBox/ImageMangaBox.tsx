import { MangaType } from "@/models/manga"
import Link from "next/link"
import Image from "next/image"

export default function ImageMangaBox({ manga, width, height }: { manga: MangaType, width: string, height: string }) {
  return (
    <Link href={`/manga/${manga.href}`} className={`relative ${height} mt-0.5 overflow-hidden cursor-pointer ${width} group/image flex-none`}>
      <div className="absolute top-0 left-0 z-10 w-full h-full transition-colors duration-200 ease-linear bg-transparent group-hover/image:bg-black/20 dark:group-hover/image:bg-black/40"></div>
      {manga.image ? (
        <Image
          className="object-fill w-full h-full transition-transform duration-550 group-hover/image:scale-110"
          src={manga.image.url}
          alt={manga.name}
          fill={true}
          quality={0}
        />
      ) : (
        <div className={`${width} ${height} bg-neutral-200 animate-pulse`}></div>
      )}
    </Link>
  )
}