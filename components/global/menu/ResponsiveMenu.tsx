import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import logo from "@/assets/Kisaragi_Alice_full.jpg"
import { motion, AnimatePresence } from "framer-motion";

export default function ResponsiveMenu({
  showModalMenu, handleOnClick, handleOnClickLink
}: {
  showModalMenu: boolean, handleOnClick: () => void, handleOnClickLink: () => void
}) {
  const myRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(myRef, handleOnClick)
  return (
    <div>
      <AnimatePresence>
        {showModalMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 z-20 w-full bg-black/50"
            style={{ height: "100dvh" }}
          />
        )}
      </AnimatePresence>
      {/* responsive menu */}
      <div ref={myRef} className={`max-w-[274px] bg-main-green px-8 py-6 transition-all duration-350 fixed z-20 top-0 left-0 md:px-12 md:py-10 ${showModalMenu ? "translate-x-0 opacity-100" : "-translate-x-[300px] opacity-0"}`} style={{ height: "100dvh" }}>
        <div className="flex flex-col">
          <Link href="/" className="flex items-center justify-center w-full mb-4 overflow-hidden h-14" onClick={handleOnClickLink}>
            <Image className="mt-8" src={logo} alt="" />
          </Link>
          <Link href="/" className="py-6 text-sm font-semibold text-white uppercase border-b cursor-pointer border-neutral-300" onClick={handleOnClickLink}>Trang chủ</Link>
          <Link href="/manga?page=1&sort=latest" className="py-6 text-sm font-semibold text-white uppercase border-b cursor-pointer border-neutral-300" onClick={handleOnClickLink}>Manga mới cập nhật</Link>
          <Link href="/manga?page=1&sort=views" className="py-6 text-sm font-semibold text-white uppercase border-b cursor-pointer border-neutral-300" onClick={handleOnClickLink}>Manga hot</Link>
          <Link href="/manga?page=1&sort=new" className="py-6 text-sm font-semibold text-white uppercase border-b cursor-pointer border-neutral-300" onClick={handleOnClickLink}>Manga mới</Link>
          <Link href="/search" className="py-6 text-sm font-semibold text-white uppercase border-b cursor-pointer border-neutral-300" onClick={handleOnClickLink}>Tìm kiếm</Link>
          <div className="py-4 cursor-pointer group" onClick={handleOnClick}>
            <svg
              className="h-8 px-2 mx-auto transition-transform duration-200 group-hover:rotate-90 w-fit fill-white"
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
          </div>
        </div>
      </div>
    </div>

  )
}