import { useDetectDirectionScroll } from "@/hooks/useDetectDirectionScroll";
import { useRouter } from "next/router";
import { CSSTransition } from 'react-transition-group';
import { Variants, motion, AnimatePresence } from "framer-motion";
import { useQuickMenuMode } from "@/hooks/useQuickMenuMode";

export default function ButtonScrollToTop() {
  const router = useRouter()
  const directionScroll = useDetectDirectionScroll()
  const { quickMenuMode } = useQuickMenuMode()
  const variants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0
    },
    show: {
      opacity: 1,
      scale: 1,
      transition: { bounce: 0.4, type: "spring", duration: 0.4 }
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
          className={`fixed ${router.query.chapterNum && !quickMenuMode ? "bottom-16 md:bottom-18" : router.query.chapterNum && quickMenuMode ? "bottom-6 md:bottom-8" : "bottom-2"} right-2 bg-second-green h-8 w-8 md:w-10 md:h-10 rounded-full flex justify-center items-center shadow-md hover:bg-black transition-colors z-50`}
          onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
        >
          <svg className="h-3 md:h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" /></svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}