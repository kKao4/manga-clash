import { MangaResponse } from "@/type"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import Parser from "html-react-parser"

export default function PageSlick({ manga }: { manga: MangaResponse["data"] }) {
  const router = useRouter()
  return (
    <div className="w-screen md:w-[572px] lg:w-[580px] h-[250px] relative overflow-hidden">
      <Image className="absolute left-1/2 -translate-x-1/2 -translate-y-[10%] w-full blur-lg" quality={50} src={manga!.image.url} alt="" width={100} height={144} />
      <div className="absolute w-full h-full slick-shadow bg-gradient-to-r from-black/40 to-black/90 blur-none" />
      <div className="absolute w-full h-full pl-2 pr-3 sm:px-8 py-4 sm:py-6 z-10 flex flex-row">
        <div className="flex-1">
          {/* star and manga's name */}
          <div className="flex flex-row gap-x-2 items-center mb-0.5">
            {/* star */}
            <div className="relative max-w-fit flex-none">
              <svg className="h-10 sm:h-12 fill-main-yellow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" /></svg>
              <p className="absolute top-1/2 left-1/2 font-semibold text-black -translate-x-1/2 -translate-y-[40%] text-xs">{manga?.rating.star}</p>
            </div>
            {/* manga's name */}
            <div className="flex flex-col -mb-1">
              <Link href={`/manga/${manga?.href}`} className="text-white text-lg sm:text-xl font-medium uppercase line-clamp-1 pr-6 sm:pr-12 hover:text-main-green transition-colors duration-300 ease-out cursor-pointer">{manga?.name}</Link>
              <p className="text-[13px] text-[rgb(255,193,7)] uppercase">Manga</p>
            </div>
          </div>
          {/* tags */}
          <div className="px-2.5">
            {manga!.tags.length ? (
              <div className="line-clamp-1 pr-8 sm:pr-24 mb-2.5 text-white">
                {manga!.tags.map((tag, i, arr) => {
                  if (i === arr.length - 1) {
                    return (
                      <Link
                        key={tag}
                        href={`/manga?page=1&sort=latest&tags=${tag.toLowerCase()}`} className="capitalize text-neutral-200 text-[13px] hover:text-main-green transition-colors"
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
                          className="text-neutral-200 text-[13px] capitalize hover:text-main-green transition-colors">
                          {tag}
                          <span className="text-neutral-200">,</span>
                        </button>{" "}
                      </Link>
                    )
                  }
                })}
              </div>
            ) : <p className="text-neutral-200 text-[13px] mb-2.5">Đang cập nhật</p>}
            <p className="text-[11px] text-neutral-200 uppercase font-bold mb-1.5">Tóm Tắt</p>
            <p className="text-[13px] text-neutral-200 line-clamp-2 pr-2 sm:pr-6 mb-1">{manga?.description ? Parser(manga?.description) : "Đang cập nhật"}</p>
            <div>
              <p className="text-neutral-200 text-[13px] inline mr-1">Trạng thái:</p>
              <span className="inline text-neutral-200 text-[13px]">{manga?.completed ? "Hoàn thành" : "Đang tiến hành"}</span>
            </div>
            <div>
              <p className="text-neutral-200 text-[13px] mr-1 inline">Tác giả:</p>
              <span className="text-neutral-200 text-[13px] inline">{manga?.author ? manga?.author : "Đang cập nhật"}</span>
            </div>
          </div>
        </div>
        {/* manga's image */}
        <div className="flex-none">
          <div className="w-[75px] h-[108px] sm:w-[100px] sm:h-[144px] cursor-pointer relative">
            <Image className="object-fill" src={manga!.image.url} alt="" fill={true} onClick={() => router.push(`/manga/${manga?.href}`)} />
          </div>
        </div>
      </div>
    </div>
  )
}