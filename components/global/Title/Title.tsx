import { ReactNode } from "react";
import GreenStar from "./GreenStar";

export default function Title({
  content, children, order
}: {
  content: string, children?: ReactNode, order: boolean
}) {
  return (
    <div className={`${order ? "flex-col sm:flex-row" : "flex-row"} relative flex items-center mt-4`}>
      <div className="flex flex-row items-center flex-none sm:w-auto grow mr-auto">
        <GreenStar />
        <p className={`ml-1 text-lg font-bold dark:text-white`}>{content}</p>
      </div>
      {children}
      <div className={`absolute bottom-0 w-full h-0.5 bg-neutral-200 dark:bg-gray-200`}></div>
    </div>
  )
}
// TODO: add dark theme to widget cloudinary and refactoring