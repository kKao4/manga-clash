import { MangaType } from "@/models/manga"
import Image from "next/image"
import { useRouter } from "next/router"

export default function TrendingManga({ manga }: { manga: MangaType }) {
  const router = useRouter()
  return (
    <div className="w-[170px] lg:w-[175px] relative hidden md:block cursor-pointer overflow-hidden group" onClick={() => router.push(`/manga/${manga.href}`)}>
      <Image src={manga.image.url} alt="" fill={true} />
      <div className="absolute flex items-end justify-center w-full h-full transition-colors duration-300 ease-out">
        <div className="w-full px-4 z-10 py-2 translate-y-2/3 group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <p className="transition-all duration-300 ease-out tracking-tighter uppercase font-bold text-main-yellow" style={{textShadow: "0px 0px 8px rgb(0,0,0), 0px 0px 2px rgb(0,0,0)"}}>manga TOP tuần</p>
          <p className="font-medium tracking-tight text-white capitalize line-clamp-3 text-sm h-[60px]">{manga.name}</p>
        </div>
        <div className="absolute h-2/3 w-full bg-gradient-to-t from-black/80 to-black/0 bottom-0 translate-y-full group-hover:translate-y-1 transition-transform duration-300 ease-out" />
        <div className="absolute h-1/5 w-full bg-gradient-to-b from-black/50 to-black/0 top-0" />
      </div>
      <svg className="h-8 fill-[#ffde00] absolute rotate-[30deg] right-1 top-1 shadow-xl" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6H426.6c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z" /></svg>
    </div>
  )
}