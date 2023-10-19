import Link from "next/link"

export default function Footer() {
  return (
    <>
      <div className="py-8 border-t-2 dark:border-t-neutral-700 dark:bg-neutral-800">
        <div className="mx-auto max-w-fit space-y-2">
          <div className="flex flex-row gap-x-4">
            <Link href={"/"} className="hover:text-second-green transition-colors font-medium dark:text-neutral-300 dark:hover:hover:text-second-green">Home</Link>
            <span className="dark:text-neutral-300">|</span>
            <Link href={"/"} className="hover:text-second-green transition-colors font-medium dark:text-neutral-300 dark:hover:hover:text-second-green">Privacy Policy</Link>
            <span className="dark:text-neutral-300">|</span>
            <Link href={"/"} className="hover:text-second-green transition-colors font-medium dark:text-neutral-300 dark:hover:hover:text-second-green">Contact Us</Link>
          </div>
          <p className="text-xs text-center dark:text-neutral-300">@ 2020 - 2023 Manga Clash</p>
        </div>
      </div>
    </>
  )
}