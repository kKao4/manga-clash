import "@/styles/globals.css"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/styles/nprogress.css"
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app"
import Menu from "@/components/global/menu/Menu"
import { Open_Sans } from "next/font/google"
import store from "@/store"
import { Provider } from "react-redux";
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import NProgress from "nprogress"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import DarkMode from "@/components/global/darkMode/DarkMode"
import { Analytics } from '@vercel/analytics/react';
import dynamic from "next/dynamic"
import Head from "next/head"
import { useWindowSize } from 'usehooks-ts'
import { Variants } from "framer-motion";
import { ToastContainer, toast, Zoom, cssTransition } from 'react-toastify';
import { useDarkMode } from "usehooks-ts";
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { DndProvider } from 'react-dnd'
import { isMobile } from "react-device-detect"
const DynamicSignUp = dynamic(() => import("@/components/global/signIn_signUp_resetPassword/sign-up"))
const DynamicSignIn = dynamic(() => import("@/components/global/signIn_signUp_resetPassword/sign-in"))
const DynamicResetPassword = dynamic(() => import("@/components/global/signIn_signUp_resetPassword/reset-password"))
const DynamicFooter = dynamic(() => import("@/components/global/footer/Footer"))
const DynamicButtonScrollToTop = dynamic(() => import("@/components/global/buttonScrollToTop/buttonScrollToTop"))

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-main",
  weight: ["400", "500", "600", "700", "800"]
})

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

NProgress.configure({
  showSpinner: false,
  minimum: 0.20
})

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter()
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false)
  const { isDarkMode } = useDarkMode()
  const { width, height } = useWindowSize()
  const getLayout = Component.getLayout ?? ((page) => page)
  const Slide = cssTransition({
    enter: width >= 768 ? "slideInBottom" : "scaleUp",
    exit: "scaleDown"
  })
  const detailVariants: Variants = {
    close: {
      width: 0,
      height: "32px",
    },
    open: {
      width: "400px",
      height: "200px",
      transition: {
        duration: 0.3,
        height: {
          delay: 0.3
        }
      }
    }
  }
  // start animation progress bar
  useEffect(() => {
    const start = () => NProgress.start()
    router.events.on("routeChangeStart", start)
    return () => router.events.off("routeChangeStart", start)
  }, [router])
  // finish animation progress bar
  useEffect(() => {
    const done = () => NProgress.done()
    router.events.on("routeChangeComplete", done)
    return () => router.events.off("routeChangeStart", done)
  }, [router])
  return (
    <Provider store={store}>
      <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
        <main className={`${openSans.className} w-full`}>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </Head>
          <DarkMode>
            <div className="min-h-[84vh] bg-white dark:bg-dark-main-black dark:text-neutral-100">
              <DynamicSignUp />
              <DynamicSignIn />
              <DynamicResetPassword />
              <Menu />
              <DynamicButtonScrollToTop />
              <ToastContainer
                position={width >= 768 ? "bottom-right" : "top-center"}
                autoClose={4000}
                limit={4}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={true}
                draggable={true}
                draggablePercent={40}
                pauseOnHover={true}
                theme={isDarkMode ? "dark" : "light"}
                transition={Slide}
              />
              {/* <div className="fixed left-18 top-32 z-20">
              <button className="absolute z-30 w-12 h-12 bg-main-green rounded-full" onClick={() => setIsOpenDetail(prevState => !prevState)} />
              <motion.div className="bg-white m-4" animate={isOpenDetail ? "open" : "close"} variants={detailVariants}></motion.div>
            </div> */}
              {getLayout(<Component {...pageProps} />)}
              <Analytics />
            </div>
            <DynamicFooter />
          </DarkMode>
        </main>
      </DndProvider>
    </Provider >
  )
}
