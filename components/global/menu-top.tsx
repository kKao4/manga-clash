import React, { useState } from "react"
import SearchBox from "./search-box";
import MenuButton from "./menu-button";
import { useDispatch, useSelector } from "react-redux";
import { Order, setSort } from "@/features/GlobalSlice";
import { useRouter } from "next/router";

export default function MenuTop() {
  const dispatch = useDispatch()
  const [showModalMenu, setShowModalMenu] = useState<boolean>(false)
  const [showSearchBox, setShowSearchBox] = useState<boolean>(false)
  const router = useRouter()
  const changeOrder = (value: Order) => {
    dispatch(setSort(value))
  }
  const closeSearchBox = () => {
    setShowSearchBox(false);
  }
  return (
    <>
      <SearchBox showSearchBox={showSearchBox} closeSearchBox={closeSearchBox} />
      <div className={`w-full h-screen bg-black/50 fixed top-0 left-0 transition-all duration-350 ${showModalMenu ? "z-10 opacity-100" : "-z-10 opacity-0"}`}>
      </div>
      {/* responsive menu */}
      <div className={`w-[300px] h-screen bg-main-green px-8 py-6 transition-transform duration-350 fixed z-20 top-0 left-0 md:px-12 md:py-10 ${showModalMenu ? "translate-x-0" : "-translate-x-[300px]"}`}>
        <div className="flex flex-col">
          <svg className="h-10 px-2 mx-auto transition-transform duration-200 cursor-pointer hover:rotate-90 w-fit fill-white" onClick={() => setShowModalMenu(false)}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
          <div className="py-6 text-sm text-white uppercase border-b cursor-pointer border-neutral-300">Home</div>
          <div className="py-6 text-sm text-white uppercase border-b cursor-pointer border-neutral-300">Latest Manga</div>
          <div className="py-6 text-sm text-white uppercase border-b cursor-pointer border-neutral-300">Hot Manga</div>
          <div className="py-6 text-sm text-white uppercase border-b cursor-pointer border-neutral-300">New Manga</div>
        </div>
      </div>
      {/* normal menu */}
      <div className="w-full bg-main-green">
        <div className="py-4 xl:max-w-[1200px] lg:max-w-[940px] mx-auto">
          <div className="flex flex-row items-center px-5">
            <div className="flex-row hidden md:flex grow">
              <MenuButton content="Trang chủ" sort="latest" href="/" handleOnClick={changeOrder} />
              <MenuButton content="Truyện mới cập nhật" sort="latest" href="/manga?page=1&sort=latest" handleOnClick={changeOrder} />
              <MenuButton content="Truyện hot" sort="views" href="/manga?page=1&sort=views" handleOnClick={changeOrder} />
              <MenuButton content="Truyện mới nhất" sort="new" href="/manga?page=1&sort=new" handleOnClick={changeOrder} />
            </div>
            {/* Responsive Menu Button */}
            <div className="block cursor-pointer grow md:hidden" onClick={() => setShowModalMenu(true)}>
              <svg className="h-6 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" /></svg>
            </div>
            {/* Search Button */}
            <div className="flex flex-row gap-x-1 lg:gap-x-2">
              <div className="relative w-8 h-8 transition-colors duration-75 bg-white rounded-full cursor-pointer group hover:bg-black" onClick={() => setShowSearchBox(s => !s)}>
                <svg className="absolute h-4 group-hover:fill-white fill-main-green top-2 left-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg>
              </div>
              <button
                className="px-2 font-semibold text-white transition-colors rounded-full hover:bg-black text-sm"
                onClick={() => router.push("/search")}
              >
                Tìm Kiếm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}