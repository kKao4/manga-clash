import React, { useEffect, useState } from "react"
import SearchBox from "./search-box";
import MenuButton from "./menu-button";
import { useDispatch, useSelector } from "react-redux";
import { Order, setSort } from "@/features/GlobalSlice";
import { useRouter } from "next/router";
import ResponsiveMenu from "./responsive-menu";
import Image from "next/image";
import AliceChan from "@/assets/Kisaragi_Alice_full.jpg"
import Link from "next/link";

export default function MenuTop() {
  const dispatch = useDispatch()
  const [showModalMenu, setShowModalMenu] = useState<boolean>(false)
  const [showSearchBox, setShowSearchBox] = useState<boolean>(false)
  const [zIndex, setZIndex] = useState<string>("-z-20")
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
      <ResponsiveMenu
        zIndex={zIndex}
        showModalMenu={showModalMenu}
        handleOnClick={() => {
          if (showModalMenu) {
            setShowModalMenu(false)
            setTimeout(() => {
              setZIndex("-z-20")
            }, 350)
          }
        }}
        handleOnClickLink={() => {
          setShowModalMenu(false)
          setTimeout(() => {
            setZIndex("-z-20")
          }, 350)
        }}
      />
      {/* normal menu */}
      <div className="w-full bg-main-green">
        <div className="py-4 xl:max-w-[1200px] lg:max-w-[940px] mx-auto">
          <div className="flex flex-row items-stretch px-5 md:items-center">
            {/* Responsive Menu Button */}
            <div className="flex items-center justify-center min-h-full pr-4 cursor-pointer sm:pr-8 md:hidden" onClick={() => {
              setShowModalMenu(true)
              setZIndex("z-20")
            }}>
              <svg className="h-6 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" /></svg>
            </div>
            <Link href="/manga?page=1&sort=latest" className="max-w-[180px] max-h-[32px] md:max-h-[44px] mr-auto overflow-hidden flex justify-center items-center xl:mr-12">
              <Image src={AliceChan} alt="alice-chan" className="mt-8" />
            </Link>
            <div className="flex-row hidden md:flex grow">
              <MenuButton content="Trang chủ" sort="latest" href="/" handleOnClick={changeOrder} />
              <MenuButton content="Truyện mới cập nhật" sort="latest" href="/manga?page=1&sort=latest" handleOnClick={changeOrder} />
              <MenuButton content="Truyện hot" sort="views" href="/manga?page=1&sort=views" handleOnClick={changeOrder} />
              <div className="items-center justify-center hidden xl:flex">
                <MenuButton content="Truyện mới nhất" sort="new" href="/manga?page=1&sort=new" handleOnClick={changeOrder} />
              </div>
            </div>
            {/* Search Button */}
            <div className="flex flex-row gap-x-1 lg:gap-x-2">
              <div className="relative w-8 h-8 transition-colors duration-75 bg-white rounded-full cursor-pointer group hover:bg-black" onClick={() => setShowSearchBox(s => !s)}>
                <svg className="absolute h-4 group-hover:fill-white fill-main-green top-2 left-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg>
              </div>
              <button
                className="hidden px-2 text-sm font-semibold text-white transition-colors rounded-full sm:block hover:bg-black"
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