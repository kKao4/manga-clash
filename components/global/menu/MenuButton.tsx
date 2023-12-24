import { Order } from "@/features/GlobalSlice"
import Link from "next/link"
import { ComponentProps } from "react";

export type MenuButtonProps = {
  content: string,
  sort: Order,
  href: string,
  handleOnClick: (value: Order) => void
} & ComponentProps<typeof Link>

export default function MenuButton({
  content,
  sort,
  href,
  handleOnClick,
  ...props
}: MenuButtonProps) {
  return (
    <Link
      href={href}
      className="px-4 py-3 cursor-pointer group"
      onClick={() => handleOnClick(sort)}
      {...props}
    >
      <div className="relative uppercase text-white text-sm font-bold">
        {content}
        <div className="absolute w-0 group-hover:w-full transition-width duration-400 h-0.5 -bottom-3 left-0 ease-out bg-neutral-100 group-hover:opacity-100 opacity-0" />
        <div className="absolute w-0 group-hover:w-full transition-width duration-400 h-0.5 -bottom-3 right-0 ease-out bg-neutral-100 opacity-100 group-hover:opacity-0" />
      </div>
    </Link>
  )
}