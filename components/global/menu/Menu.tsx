import React, { useState } from "react"
import MenuButton from "./MenuButton";
import { useDispatch, useSelector } from "react-redux";
import { Order, selectDarkMode, setSort, toggleDarkMode } from "@/features/GlobalSlice";
import Image from "next/image";
import AliceChan from "@/assets/Kisaragi_Alice_full.jpg"
import Link from "next/link";
import { setSearchName } from "@/features/search/SearchSlice";
import dynamic from "next/dynamic";
const DynamicSearchBox = dynamic(() => import("../searchBox/SearchBox"))
const DynamicResponsiveMenu = dynamic(() => import("./ResponsiveMenu"))

export default function Menu() {
  const dispatch = useDispatch()
  const [showModalMenu, setShowModalMenu] = useState<boolean>(false)
  const [showSearchBox, setShowSearchBox] = useState<boolean>(false)
  const [zIndex, setZIndex] = useState<string>("-z-20")
  const darkMode = useSelector(selectDarkMode)
  const changeOrder = (value: Order) => {
    dispatch(setSort(value))
  }
  return (
    <>
      {/* search box */}
      <DynamicSearchBox showSearchBox={showSearchBox} setShowSearchBox={setShowSearchBox} />
      {/* responsive menu */}
      <DynamicResponsiveMenu
        zIndex={zIndex}
        setZIndex={setZIndex}
        showModalMenu={showModalMenu}
        setShowModalMenu={setShowModalMenu}
        handleOnClick={() => {
          if (showModalMenu) {
            setShowModalMenu(false)
          }
        }}
        handleOnClickLink={() => {
          setShowModalMenu(false)
        }}
      />
      {/* normal menu */}
      <div className="w-full bg-main-green">
        <div className="py-3 md:py-4 xl:max-w-[1200px] lg:max-w-[940px] mx-auto">
          <div className="flex flex-row items-stretch px-5 md:items-center">
            {/* Responsive Menu Button */}
            <div className="flex items-center justify-center min-h-full pr-4 cursor-pointer sm:pr-8 md:hidden" onClick={() => {
              setShowModalMenu(true)
              setZIndex("z-20")
            }}>
              <svg className="h-6 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" /></svg>
            </div>
            <Link href="/" className="max-w-[180px] max-h-[32px] md:max-h-[44px] mr-auto overflow-hidden flex justify-center items-center xl:mr-12">
              <Image src={AliceChan} alt="alice-chan" className="mt-8" priority={true} quality={0} />
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
              <div
                className="relative w-8 h-8 transition-colors bg-white rounded-full cursor-pointer group hover:bg-black"
                onClick={() => {
                  if (showSearchBox) {
                    setShowSearchBox(false)
                    dispatch(setSearchName(""))
                  } else {
                    setShowSearchBox(true)
                  }
                }}
              >
                <svg className="absolute h-4 group-hover:fill-white fill-main-green top-2 left-2 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg>
              </div>
              <button className="w-8 h-8 bg-white rounded-full flex justify-center items-center group hover:bg-black transition-colors" onClick={() => dispatch(toggleDarkMode())}>
                {darkMode ? (
                  <svg className="h-5 fill-main-green group-hover:fill-white transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-sun-fill h-[1.325rem] fill-main-green group-hover:fill-white transition-colors" viewBox="0 0 16 16">
                    <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}