import { motion } from "framer-motion"

export default function Button({ content, handleOnClick }: { content: string, handleOnClick: any }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className="px-3 py-1 text-sm font-bold text-gray-200 transition-colors border-2 border-gray-200 rounded-full dark:text-neutral-300 dark:text hover:border-black dark:hover:bg-neutral-700 dark:hover:text-neutral-200 dark:hover:border-neutral-700 dark:border-neutral-600 hover:text-white hover:bg-black"
      onClick={handleOnClick}
    >
      {content}
    </motion.button>
  )
}