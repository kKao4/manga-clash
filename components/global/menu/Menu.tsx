import React, { useMemo, useState } from "react"
import MenuButton from "./MenuButton";
import { useDispatch } from "react-redux";
import { Order, setSort } from "@/features/GlobalSlice";
import Image from "next/image";
import AliceChan from "@/assets/Kisaragi_Alice_full.jpg"
import Link from "next/link";
import { setSearchName } from "@/features/search/SearchSlice";
import dynamic from "next/dynamic";
import { Variants, motion } from "framer-motion"
import { useDarkMode } from "@/hooks/useDarkMode";
const DynamicSearchBox = dynamic(() => import("../searchBox/SearchBox"))
const DynamicResponsiveMenu = dynamic(() => import("./ResponsiveMenu"))

const svgVariants: Variants = {
  hiddenUp: {
    y: -40,
    opacity: 0
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  hiddenDown: {
    y: 40,
    opacity: 0
  }
}

export default function Menu() {
  const dispatch = useDispatch()
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [showModalMenu, setShowModalMenu] = useState<boolean>(false)
  const [showSearchBox, setShowSearchBox] = useState<boolean>(false)
  const changeOrder = (value: Order) => {
    dispatch(setSort(value))
  }
  return (
    <>
      {/* search box */}
      <DynamicSearchBox showSearchBox={showSearchBox} setShowSearchBox={setShowSearchBox} />
      {/* responsive menu */}
      <DynamicResponsiveMenu
        showModalMenu={showModalMenu}
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
        <div className="py-3 xl:max-w-[1200px] lg:max-w-[940px] mx-auto">
          <div className="flex flex-row items-stretch px-5 md:items-center">
            {/* Responsive Menu Button */}
            <div
              className="flex items-center justify-center min-h-full pr-4 cursor-pointer sm:pr-8 md:hidden" onClick={() => {
                setShowModalMenu(true)
                // setZIndex("z-20")
              }}
            >
              <svg className="h-6 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" /></svg>
            </div>
            {/* logo */}
            <motion.div
              className="mr-auto"
              whileTap={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link href="/" className="relative mr-auto max-w-[180px] max-h-[32px] md:max-h-[44px] overflow-hidden flex justify-center items-center xl:mr-12 drop-shadow-md" role="logo-button-menu">
                <Image src={AliceChan} alt="alice-chan" className="mt-8" priority={true} quality={100} />
                <motion.div
                  className="absolute w-[18px] h-[200px] -rotate-45 bg-gradient-to-l from-white/60 to-white/0" initial={{ left: "-28%" }}
                  animate={{ left: "118%" }}
                  transition={{ repeat: Infinity, repeatDelay: 4, duration: 1, delay: 2 }}
                />
              </Link>
            </motion.div>
            {/* menu */}
            <div className="flex-row hidden md:flex grow gap-x-1">
              <MenuButton content="Trang chủ" sort="latest" href="/" handleOnClick={changeOrder} role="home-button-menu" />
              <MenuButton content="Truyện mới cập nhật" sort="latest" href="/manga?page=1&sort=latest" handleOnClick={changeOrder} role="manga-latest-button-menu" />
              <MenuButton content="Truyện hot" sort="views" href="/manga?page=1&sort=views" handleOnClick={changeOrder} role="manga-hot-button-menu" />
              <div className="items-center justify-center hidden xl:flex">
                <MenuButton content="Truyện mới nhất" sort="new" href="/manga?page=1&sort=new" handleOnClick={changeOrder} role="manga-new-button-menu" />
              </div>
            </div>
            <div className="flex flex-row gap-x-1.5 lg:gap-x-2">
              {/* Search Button */}
              <motion.button
                className="relative w-8 h-8 transition-colors bg-white rounded-full cursor-pointer group hover:bg-black mr-auto"
                onClick={() => {
                  if (showSearchBox) {
                    setShowSearchBox(false)
                    dispatch(setSearchName(""))
                  } else {
                    setShowSearchBox(true)
                  }
                }}
                whileTap={{ scale: 0.88 }}
                role="menu-search-button"
              >
                <svg className="absolute h-4 transition-colors group-hover:fill-white fill-main-green top-2 left-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg>
              </motion.button>
              {/* dark/light theme btn */}
              <motion.button
                className="flex items-center justify-center mr-auto w-8 h-8 transition-colors bg-white rounded-full group hover:bg-black overflow-hidden relative"
                onClick={() => toggleDarkMode()}
                whileTap={{ scale: 0.88 }}
                role="theme-button"
              >
                <motion.svg initial={isDarkMode ? "show" : "hiddenDown"} animate={isDarkMode ? "show" : "hiddenDown"} variants={svgVariants} className={`absolute h-5 transition-colors fill-main-green group-hover:fill-white`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" /></motion.svg>
                <motion.svg initial={isDarkMode ? "hiddenUp" : "show"} animate={isDarkMode ? "hiddenUp" : "show"} variants={svgVariants} className={`absolute h-5 transition-colors fill-main-green group-hover:fill-white`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z" /></motion.svg>
              </motion.button>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}