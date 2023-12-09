import { ReactNode, useState } from "react";
import GreenStar from "./GreenStar";

export default function Title({
  content, children, order, forceDarkMode = false
}: {
  content: string, children?: ReactNode, order: boolean, forceDarkMode?: boolean
}) {
  return (
    <div className={`${order ? "flex-col sm:flex-row" : "flex-row"} relative flex items-center mt-2 md:mt-4`}>
      <div className="flex flex-row items-center flex-none mr-auto sm:w-auto grow">
        <GreenStar />
        <p className={`ml-1 text-lg font-bold ${forceDarkMode ? "text-neutral-100" : "dark:text-neutral-100"}`}>{content}</p>
      </div>
      {children}
      <div className={`absolute bottom-0 w-full h-0.5 ${forceDarkMode ? "bg-gray-200" : "bg-neutral-200 dark:bg-gray-200"}`}></div>
    </div>
  )
}