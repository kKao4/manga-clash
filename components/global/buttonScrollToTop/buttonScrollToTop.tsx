import { useDetectDirectionScrollY } from "@/hooks/useDetectDirectionScrollY";
import { useRouter } from "next/router";
import { CSSTransition } from 'react-transition-group';
import { Variants, motion, AnimatePresence } from "framer-motion";

export default function ButtonScrollToTop() {
  const router = useRouter()
  const directionScroll = useDetectDirectionScrollY()
  const variants: Variants = {
    hidden: {
      opacity: 0,
      transform: "scale(0.6)",
    },
    show: {
      opacity: 1,
      transform: "scale(1)"
    }
  }
  return (
    // <CSSTransition
    //   in={directionScroll === "up"}
    //   timeout={150}
    //   unmountOnExit
    //   classNames="scrollToTopBtn"
    // >
    //   <button
    //     className={`fixed ${router.query.chapterNum ? "bottom-18" : "bottom-2"} right-2 bg-second-green h-8 w-8 md:w-10 md:h-10 rounded-full flex justify-center items-center shadow hover:bg-black`}
    //     onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
    //   >
    //     <svg className="h-3 md:h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" /></svg>
    //   </button>
    // </CSSTransition>
    <AnimatePresence>
      {directionScroll === "up" && (
        <motion.button
          initial="hidden"
          animate="show"
          exit="hidden"
          variants={variants}
          transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
          className={`fixed ${router.query.chapterNum ? "bottom-18" : "bottom-2"} right-2 bg-second-green h-8 w-8 md:w-10 md:h-10 rounded-full flex justify-center items-center shadow hover:bg-black transition-colors z-50`}
          onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
        >
          <svg className="h-3 md:h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" /></svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}