import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Footer() {
  const router = useRouter()
  const [enableDarkMode, setEnableDarkMode] = useState<boolean>(false)
  useEffect(() => {
    setEnableDarkMode(() => router.query.chapterNum ? true : false)
  }, [router])
  return (
    <>
      <div className={`py-8 border-t-2 ${enableDarkMode ? "dark:border-t-neutral-700 dark:bg-neutral-800" : ""}`}>
        <div className="mx-auto max-w-fit space-y-2">
          <div className="flex flex-row gap-x-4">
            <Link href={"/"} className={`hover:text-second-green transition-colors font-medium ${enableDarkMode ? "dark:text-neutral-300 dark:hover:hover:text-second-green" : ""}`}>Home</Link>
            <span className={enableDarkMode ? "dark:text-neutral-300" : ""}>|</span>
            <Link href={"/"} className={`hover:text-second-green transition-colors font-medium ${enableDarkMode ? "dark:text-neutral-300 dark:hover:hover:text-second-green" : ""}`}>Privacy Policy</Link>
            <span className={enableDarkMode ? "dark:text-neutral-300" : ""}>|</span>
            <button
              className={`hover:text-second-green transition-colors font-medium ${enableDarkMode ? "dark:text-neutral-300 dark:hover:hover:text-second-green" : ""}`}
              onClick={() => window.open("https://github.com/kKao4", "_blank")}
            >
              Contact Me
            </button>
          </div>
          <p className={`text-xs text-center ${enableDarkMode ? "dark:text-neutral-300" : ""}`}>@ 2023 Manga Website by kKao4</p>
        </div>
      </div >
    </>
  )
}