import Link from "next/link"

export default function Footer() {
  return (
    <>
      <div className={`py-8 border-t dark:border-t-neutral-700 dark:bg-neutral-800`}>
        <div className="mx-auto space-y-2 max-w-fit">
          <div className="flex flex-row gap-x-4">
            <Link href={"/"} className={`hover:text-second-green transition-colors font-medium dark:text-neutral-300 dark:hover:text-third-green`}>Home</Link>
            <span className={"dark:text-neutral-300"}>|</span>
            <Link href={"/"} className={`hover:text-second-green transition-colors font-medium dark:text-neutral-300 dark:hover:text-third-green`}>Privacy Policy</Link>
            <span className={"dark:text-neutral-300"}>|</span>
            <button
              className={`hover:text-second-green transition-colors font-medium dark:text-neutral-300 dark:hover:text-third-green`}
              onClick={() => window.open("https://github.com/kKao4", "_blank")}
            >
              Contact Me
            </button>
          </div>
          <p className={`text-xs text-center dark:text-neutral-300`}>@ 2023 Manga Website by kKao4</p>
        </div>
      </div >
    </>
  )
}