import { useDispatch, useSelector } from "react-redux"
import MenuFootBox from "../global/MenuFootBox"
import { selectSearchState, setSearchName } from "@/features/search/SearchSlice"
import { useRouter } from "next/router"
import { MyRipples } from "../global/ButtonRipple"
import { useState } from "react"
import dynamic from "next/dynamic";
const DynamicAdvanced = dynamic(() => import("@/components/search/Advanced"))

export default function MenuFoot({ setSearched }: { setSearched: any }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const searchState = useSelector(selectSearchState)
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)
  return (
    <MenuFootBox>
      <div className="flex flex-col items-stretch py-4 sm:flex-row gap-x-4 gap-y-4 md:gap-x-10">
        <form className="flex flex-row grow" onSubmit={(e) => {
          e.preventDefault()
          router.push(`/search?page=1&sort=latest&name=${searchState.name}`, "", { scroll: false })
        }}>
          {/* input search box */}
          <input
            className="w-full px-4 py-3 text-lg md:px-6 rounded-l-md focus:outline-none dark:bg-neutral-700"
            type="text"
            value={searchState.name}
            onChange={(e) => dispatch(setSearchName(e.target.value))}
          />
          {/* submit button */}
          <MyRipples className="rounded-r-md min-w-fit">
            <button type="submit" className="relative h-full font-bold text-white transition-colors px-9 max-w-fit bg-second-green hover:bg-black">
              <svg className="absolute h-5 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg>
            </button>
          </MyRipples>
        </form>
        {/* advanced button */}
        <MyRipples className="max-w-fit">
          <button
            className="px-6 py-4 font-bold text-white transition-colors max-w-fit bg-second-green hover:bg-black"
            onClick={() => setShowAdvanced(s => !s)}
          >
            Nâng Cao
            <svg className="inline-block h-3 ml-1 align-baseline fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" /></svg>
          </button>
        </MyRipples>
      </div>
      <div className={`${showAdvanced ? "opacity-100 max-h-[820px] sm:max-h-[600px] md:max-h-[500px]" : "max-h-0 opacity-0"} overflow-hidden transition-all duration-400`}>
        <DynamicAdvanced setSearched={setSearched} />
      </div>
    </MenuFootBox>
  )
}