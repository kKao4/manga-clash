import Link from "next/link"
import { Order } from "@/features/GlobalSlice"
import { motion } from "framer-motion"
import { useRouter } from "next/router"

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
    <motion.div
      className="px-4 py-3 text-sm font-bold text-white cursor-pointer group"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ type: "tween", duration: 0.4 }}
      viewport={{ once: true }}
      onClick={() => {
        handleOnClick(sort)
        router.push(href)
      }}
    >
      <div className="relative uppercase group">{content}
        <div className="absolute w-0 group-hover:w-full transition-width duration-400 h-0.5 -bottom-3 left-0 ease-out bg-neutral-100 group-hover:opacity-100 opacity-0" />
        <div className="absolute w-0 group-hover:w-full transition-width duration-400 h-0.5 -bottom-3 right-0 ease-out bg-neutral-100 opacity-100 group-hover:opacity-0" />
      </div>
    </motion.div>
  )
}