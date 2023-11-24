import "@/styles/globals.css"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/styles/nprogress.css"
import type { AppProps } from "next/app"
import MenuTop from "@/components/global/menu-top"
import { Open_Sans } from "next/font/google"
import store from "@/store"
import { Provider } from "react-redux";
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import NProgress from "nprogress"
import { useEffect } from "react"
import { useRouter } from "next/router"
import DarkMode from "@/components/global/dark-mode"
import { Analytics } from '@vercel/analytics/react';
import dynamic from "next/dynamic"
import Head from "next/head"
const DynamicSignUp = dynamic(() => import("@/components/global/sign-up"))
const DynamicSignIn = dynamic(() => import("@/components/global/sign-in"))
const DynamicResetPassword = dynamic(() => import("@/components/global/reset-password"))
const DynamicFooter = dynamic(() => import("@/components/global/footer"))
const DynamicButtonScrollToTop = dynamic(() => import("@/components/buttonScrollToTop/buttonScrollToTop"))

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
  const getLayout = Component.getLayout ?? ((page) => page)
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
      <main className={`${openSans.className} w-full`}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <DarkMode>
          <div className="min-h-[84vh]">
            <DynamicSignUp />
            <DynamicSignIn />
            <DynamicResetPassword />
            <MenuTop />
            <DynamicButtonScrollToTop />
            {getLayout(<Component {...pageProps} />)}
            <Analytics />
          </div>
          <DynamicFooter />
        </DarkMode>
      </main>
    </Provider >
  )
}
