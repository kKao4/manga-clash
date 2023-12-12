import { useDispatch } from "react-redux"
import { toggleGuide } from "@/features/GlobalSlice"
import { Variants, motion } from "framer-motion"

export default function ButtonGuide() {
  const dispatch = useDispatch()
  const buttonVariants: Variants = {
    hidden: { scale: 1 },
    show: { scale: 1.25, transition: { repeat: 7, delay: 2, duration: 0.3, type: "tween", repeatType: "reverse" } },
  }
  return (
    <div className="fixed left-4 bottom-5 rounded-full flex flex-row items-center">
      <motion.button
        initial="hidden"
        animate="show"
        variants={buttonVariants}
        className="w-13 h-13 rounded-full shadow-md bg-second-green flex transition-colors hover:bg-black justify-center items-center z-10"
        onClick={() => dispatch(toggleGuide(true))}
      >
        <svg className="h-7 fill-neutral-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm169.8-90.7c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" /></svg>
      </motion.button>
      <motion.div initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1, delay: 1.5, type: "spring" }} className="px-2 py-1 bg-main-green text-neutral-100 -ml-2 rounded pl-3 text-sm">
        Giới thiệu
      </motion.div>
    </div>
  )
}