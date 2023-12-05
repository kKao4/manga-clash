import { Order } from "@/features/GlobalSlice"
import { motion } from "framer-motion"
import { useRouter } from "next/router"
import Link from "next/link"

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
  const router = useRouter()
  return (
    <Link
      href={href}
      className="px-4 py-3 cursor-pointer group"
      onClick={() => handleOnClick(sort)}
    >
      <div className="relative uppercase text-white text-sm font-bold">
        {content}
        <div className="absolute w-0 group-hover:w-full transition-width duration-400 h-0.5 -bottom-3 left-0 ease-out bg-neutral-100 group-hover:opacity-100 opacity-0" />
        <div className="absolute w-0 group-hover:w-full transition-width duration-400 h-0.5 -bottom-3 right-0 ease-out bg-neutral-100 opacity-100 group-hover:opacity-0" />
      </div>
    </Link>
  )
}