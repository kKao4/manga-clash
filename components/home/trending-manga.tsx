import { MangaType } from "@/models/manga"
import Image from "next/image"

export default function TrendingManga({ manga }: { manga: MangaType }) {
  return (
    <div className="w-[170px] lg:w-[175px] relative hidden md:block">
      <Image src={manga.image.url} alt="" fill={true} />
      <div className="absolute w-full h-full slick-shadow bg-black/40 flex justify-center items-center">
        <div className="px-1.5 -mt-8 space-y-0.5">
          <p className="uppercase text-white font-medium tracking-tighter leading-5">manga <strong className="font-bold">trending</strong> this week</p>
          <p className="text-white font-bold uppercase tracking-tight leading-5">{manga.name}</p>
        </div>
      </div>
      <svg className="h-8 fill-[#ffde00] absolute rotate-[30deg] right-1.5 top-1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6H426.6c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z" /></svg>
    </div>
  )
}