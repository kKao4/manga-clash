import { ReactNode } from "react";
import GreenStar from "./green-star";

export default function Title({ content, children, order }: { content: string, children?: ReactNode, order: boolean }) {
  return (
    <div className={`${order ? "flex-col sm:flex-row" : "flex-row"} relative flex items-center mt-6`}>
      <div className="flex flex-row items-center w-full sm:w-auto grow">
        <GreenStar />
        <p className="ml-1 text-lg font-bold dark:text-white">{content}</p>
      </div>
      {children}
      <div className="absolute bottom-0 w-full h-0.5 bg-neutral-200 -z-10"></div>
    </div>
  )
}