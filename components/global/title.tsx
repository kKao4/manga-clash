import { ReactNode, useEffect, useState } from "react";
import GreenStar from "./green-star";
import { useRouter } from "next/router";

export default function Title({
  content, children, order
}: {
  content: string, children?: ReactNode, order: boolean
}) {
  const router = useRouter()
  const [enableDarkMode, setEnableDarkMode] = useState<boolean>(false)
  useEffect(() => {
    setEnableDarkMode(() => router.query.chapterNum ? true : false)
  }, [router])
  return (
    <div className={`${order ? "flex-col sm:flex-row" : "flex-row"} relative flex items-center mt-4`}>
      <div className="flex flex-row items-center w-full sm:w-auto grow flex-none">
        <GreenStar />
        <p className={`ml-1 text-lg font-bold ${enableDarkMode ? "dark:text-white" : ""}`}>{content}</p>
      </div>
      {children}
      <div className={`absolute bottom-0 w-full h-0.5 bg-neutral-200 ${enableDarkMode ? "dark:bg-gray-200" : ""}`}></div>
    </div>
  )
}