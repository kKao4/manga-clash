import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function Footer() {
  const router = useRouter()
  const [forceDarkMode, setForceDarkMode] = useState<boolean>(false)
  // Nếu là page đọc chapter thì bắt buộc footer mặc định là chế độ tối
  useEffect(() => {
    setForceDarkMode(router.query.chapterNum ? true : false)
  }, [router.query.chapterNum])
  return (
    <>
      <div className={`py-8 border-t ${forceDarkMode ? "border-t-neutral-700 bg-neutral-800" : "dark:border-t-neutral-700 dark:bg-neutral-800"}`}>
        <div className="mx-auto space-y-2 max-w-fit">
          <div className="flex flex-row gap-x-4">
            <Link href={"/"} className={`transition-colors font-medium ${forceDarkMode ? "text-neutral-300 hover:text-third-green" : "hover:text-second-green dark:text-neutral-300 dark:hover:text-third-green"}`}>Trang chủ</Link>
            <span className={forceDarkMode ? "text-neutral-300" : "dark:text-neutral-300"}>|</span>
            <Link href={"/"} className={`transition-colors font-medium ${forceDarkMode ? "text-neutral-300 hover:text-third-green" : "hover:text-second-green dark:text-neutral-300 dark:hover:text-third-green"}`}>Điều khoản</Link>
            <span className={forceDarkMode ? "text-neutral-300" : "dark:text-neutral-300"}>|</span>
            <button
              className={`transition-colors font-medium ${forceDarkMode ? "text-neutral-300 hover:text-third-green" : "hover:text-second-green dark:text-neutral-300 dark:hover:text-third-green"}`}
              onClick={() => window.open("https://github.com/kKao4", "_blank")}
            >
              Contact Me
            </button>
          </div>
          <p className={`text-xs text-center ${forceDarkMode ? "text-neutral-300" : "dark:text-neutral-300"}`}>@ 2023 Manga Website bởi kKao4</p>
        </div>
      </div >
    </>
  )
}