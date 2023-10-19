import Link from "next/link"
import { Order } from "@/features/GlobalSlice"

export default function MenuButton({
  content,
  sort,
  href,
  handleOnClick
}: {
  content: string,
  sort: Order,
  href: string,
  handleOnClick: (value: Order) => void
}) {
  return (
    <Link
      href={href}
      scroll={false}
      className="relative px-5 py-3 text-sm font-bold text-white cursor-pointer group"
      onClick={() => {
        handleOnClick(sort)
      }}
    >
      <span className="uppercase">{content}</span>
      <span className="absolute w-0 group-hover:w-1/4 transition-all duration-300 h-px bottom-1.5 left-1/2 bg-neutral-200"></span>
      <span className="absolute w-0 group-hover:w-1/4 transition-all duration-300 h-px bottom-1.5 right-1/2 bg-neutral-200"></span>
    </Link>
  )
}