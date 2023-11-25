import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import logo from "@/assets/Kisaragi_Alice_full.jpg"

export default function ResponsiveMenu({
  zIndex, showModalMenu, handleOnClick, handleOnClickLink, setShowModalMenu, setZIndex
}: {
  zIndex: string, showModalMenu: boolean, handleOnClick: any, handleOnClickLink: any, setShowModalMenu: any, setZIndex: any
}) {
  const myRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(myRef, handleOnClick)
  return (
    <>
      <div
        className={`w-full h-screen ${zIndex} bg-black/50 fixed top-0 left-0 transition-opacity duration-300 ease-out ${showModalMenu ? "opacity-100" : "opacity-0"}`}
        onTransitionEnd={() => {
          if (!showModalMenu) {
            setZIndex("-z-20")
          }
        }}
      >
      </div>
      {/* responsive menu */}
      <div ref={myRef} className={`w-[240px] sm:w-[300px] h-screen bg-main-green px-8 py-6 transition-transform duration-350 fixed z-20 top-0 left-0 md:px-12 md:py-10 ${showModalMenu ? "translate-x-0" : "-translate-x-[300px]"}`}>
        <div className="flex flex-col">
          <Link href="/" className="w-full h-14 flex justify-center items-center overflow-hidden mb-4" onClick={handleOnClickLink}>
            <Image className="mt-8" src={logo} alt="" />
          </Link>
          <Link href="/" className="py-6 font-semibold text-sm text-white uppercase border-b cursor-pointer border-neutral-300" onClick={handleOnClickLink}>Trang chủ</Link>
          <Link href="/manga?page=1&sort=latest" className="py-6 font-semibold text-sm text-white uppercase border-b cursor-pointer border-neutral-300" onClick={handleOnClickLink}>Manga mới cập nhật</Link>
          <Link href="/manga?page=1&sort=views" className="py-6 font-semibold text-sm text-white uppercase border-b cursor-pointer border-neutral-300" onClick={handleOnClickLink}>Manga hot</Link>
          <Link href="/manga?page=1&sort=new" className="py-6 font-semibold text-sm text-white uppercase border-b cursor-pointer border-neutral-300" onClick={handleOnClickLink}>Manga mới</Link>
          <Link href="/search" className="py-6 font-semibold text-sm text-white uppercase border-b cursor-pointer border-neutral-300" onClick={handleOnClickLink}>Tìm kiếm</Link>
          <div className="py-4 group cursor-pointer" onClick={handleOnClick}>
            <svg
              className="h-10 px-2 mx-auto transition-transform duration-200 group-hover:rotate-90 w-fit fill-white"
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
          </div>
        </div>
      </div>
    </>
  )
}