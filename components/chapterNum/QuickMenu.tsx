import { Variants, motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePopper } from "react-popper"
import { ChapterResponse, ChaptersResponse, QuickMenuCord } from "@/type"
import { isMobile } from "react-device-detect"
import { useQuickMenuMode } from "@/hooks/useQuickMenuMode"
import { ConnectDragSource } from "react-dnd"

export interface QuickMenuProps {
  quickMenuCord: QuickMenuCord,
  isDragging: boolean,
  drag: ConnectDragSource,
  chapterRes: ChapterResponse,
  chaptersRes: ChaptersResponse,
  prevChapter: string,
  nextChapter: string
}

export default function QuickMenu({ quickMenuCord, isDragging, drag, chapterRes, chaptersRes, prevChapter, nextChapter }: QuickMenuProps) {
  const { quickMenuMode } = useQuickMenuMode()
  const [isOpenChaptersQuickMenu, setIsOpenChaptersQuickMenu] = useState<boolean>(false)
  const [isOpenDetailQuickMenu, setIsOpenDetailQuickMenu] = useState<boolean>(false)
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "right",
    strategy: "fixed",
    modifiers: [
      { name: 'arrow', options: { element: arrowElement } },
      { name: "offset", options: { offset: [-2.5, isMobile ? 12 : 24] } },
      { name: "flip", options: { fallbackPlacements: ["left"] } },
    ],
  });
  // Tự động đóng chapter popper khi đóng detail quick menu hoặc tắt quick menu mode
  useEffect(() => {
    if (!quickMenuMode || !isOpenDetailQuickMenu) {
      setIsOpenChaptersQuickMenu(false)
    }
  }, [quickMenuMode, isOpenDetailQuickMenu])

  const quickMenuContainerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { scale: { type: "spring", bounce: 0.5, duration: 0.6 } } }
  }
  const quickMenuVariants: Variants = {
    hidden: { backgroundColor: "rgba(0,0,0,0)" },
    show: { backgroundColor: "rgba(0,0,0,0.3)" },
  }
  const quickMenuButtonVariants: Variants = {
    hidden: { y: -12, opacity: 0, transition: { duration: 0.25 } },
    show: { y: 0, opacity: 1 }
  }
  return (
    <>
      <div className="fixed z-50" style={{ left: quickMenuCord.x + "px", top: quickMenuCord.y + "px" }}>
        <AnimatePresence>
          {quickMenuMode && (
            <motion.div
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={quickMenuContainerVariants}
            >
              <motion.div
                initial="hidden"
                animate={isOpenDetailQuickMenu ? "show" : "hidden"}
                variants={quickMenuVariants}
                className="w-18 py-2 pb-2.5 rounded-lg flex flex-col gap-y-2"
              >
                <motion.button
                  className={`w-13 h-13 mx-auto mb-1 bg-main-green hover:bg-[#337a6c] transition-colors flex justify-center items-center shadow-lg rounded-full cursor-pointer ${isDragging ? "opacity-70" : ""}`}
                  ref={drag}
                  onClick={() => setIsOpenDetailQuickMenu(prevState => !prevState)}
                  whileTap={{ scale: 0.92 }}
                >
                  <svg className="fill-neutral-100 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" /></svg>
                </motion.button>
                {/* menu button */}
                <AnimatePresence>
                  {isOpenDetailQuickMenu && (
                    <motion.div
                      className="flex flex-col gap-y-2"
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                      variants={{
                        show: { transition: { staggerChildren: 0.05 } }
                      }}
                    >
                      <motion.button
                        variants={quickMenuButtonVariants}
                      >
                        <Link
                          href={`/manga/${chapterRes.data?.href}`}
                          className="w-12 h-12 bg-neutral-700 hover:bg-neutral-600 transition-colors rounded-full mx-auto flex justify-center items-center"
                        >
                          <svg className="h-5 fill-white mb-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M543.8 287.6c17 0 32-14 32-32.1c1-9-3-17-11-24L512 185V64c0-17.7-14.3-32-32-32H448c-17.7 0-32 14.3-32 32v36.7L309.5 7c-6-5-14-7-21-7s-15 1-22 8L10 231.5c-7 7-10 15-10 24c0 18 14 32.1 32 32.1h32v69.7c-.1 .9-.1 1.8-.1 2.8V472c0 22.1 17.9 40 40 40h16c1.2 0 2.4-.1 3.6-.2c1.5 .1 3 .2 4.5 .2H160h24c22.1 0 40-17.9 40-40V448 384c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32v64 24c0 22.1 17.9 40 40 40h24 32.5c1.4 0 2.8 0 4.2-.1c1.1 .1 2.2 .1 3.3 .1h16c22.1 0 40-17.9 40-40V455.8c.3-2.6 .5-5.3 .5-8.1l-.7-160.2h32z" /></svg>
                        </Link>
                      </motion.button>
                      {/* chapters select button */}
                      <motion.button
                        ref={setReferenceElement as any}
                        variants={quickMenuButtonVariants}
                        className="w-12 h-12 bg-neutral-700 hover:bg-neutral-600 transition-colors rounded-full mx-auto flex justify-center items-center font-medium text-lg relative text-neutral-100"
                        onClick={() => setIsOpenChaptersQuickMenu(prevState => !prevState)}
                      >
                        <span className="mb-0.5">{chapterRes.data?.chapter.num}</span>
                      </motion.button>
                      <AnimatePresence>
                        {isOpenChaptersQuickMenu && (
                          <div
                            ref={setPopperElement as any}
                            style={styles.popper}
                            {...attributes.popper}
                          >
                            <motion.div
                              initial={{ opacity: 0, x: -14 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -14 }}
                              className="bg-neutral-700 rounded-md overflow-y-auto max-h-[400px] w-56 p-1.5 chaptersBox flex flex-col"
                            >
                              {chaptersRes.data?.chapters.map((chapter) => {
                                return (
                                  <Link
                                    key={chapter.num + "-quick-menu"}
                                    href={`/manga/${chaptersRes.data?.href}/chapter-${chapter.num}`}
                                    className={`w-full px-2 py-1 ${chapterRes.data?.chapter.num === chapter.num ? "bg-main-green" : "hover:bg-neutral-600"} transition-colors rounded text-center text-neutral-100`}
                                  >
                                    Chapter {chapter.num}
                                  </Link>
                                )
                              })}
                              {!isMobile && (
                                <div
                                  ref={setArrowElement as any}
                                  style={styles.arrow}
                                  className={`w-0 h-0 -left-4 border-8 border-transparent border-r-neutral-700`}
                                />
                              )}
                            </motion.div>
                          </div>
                        )}
                      </AnimatePresence>
                      {/* prev chapter button */}
                      <motion.button
                        variants={quickMenuButtonVariants}
                      >
                        <Link
                          href={`/manga/${chapterRes.data?.href}/chapter-${prevChapter}`}
                          className="w-12 h-12 bg-neutral-700 transition-colors rounded-full mx-auto hover:bg-neutral-600 flex justify-center items-center"
                        >
                          <svg className="h-5 fill-white mr-0.5 mb-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4L288 214.3V256v41.7L459.5 440.6zM256 352V256 128 96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160C4.2 237.5 0 246.5 0 256s4.2 18.5 11.5 24.6l192 160c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V352z" /></svg>
                        </Link>
                      </motion.button>
                      {/* next chapter button */}
                      <motion.button
                        variants={quickMenuButtonVariants}
                      >
                        <Link
                          href={`/manga/${chapterRes.data?.href}/chapter-${nextChapter}`}
                          className="w-12 h-12 bg-neutral-700 rounded-full mx-auto hover:bg-neutral-600 transition-colors flex justify-center items-center"
                        >
                          <svg className="h-5 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3V256v41.7L52.5 440.6zM256 352V256 128 96c0-12.4 7.2-23.7 18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29V352z" /></svg>
                        </Link>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}