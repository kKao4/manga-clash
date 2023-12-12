import BodyBox from "@/components/global/box/BodyBox"
import { ChartResponse, HistoryResponse, MangasResponse, UserResponse } from "@/type"
import { InferGetServerSidePropsType, GetServerSideProps } from "next"
import Head from "next/head"
import { useEffect, useMemo } from "react"
import MenuTab from "@/components/user-settings/MenuTab"
import { useSelector, useDispatch } from "react-redux"
import { selectUserSettingsState, setMenu } from "@/features/user-settings/UserSettingsSlice"
import UserMenu from "@/components/global/userMenu/UserMenu"
import dynamic from "next/dynamic"
import { selectUserState, setUser } from "@/features/UserSlice"
import { setMangasBookmark, selectBookmarkState } from "@/features/user-settings/BookmarkSlice"
import { setMangasChart } from "@/features/user-settings/ChartSlice"
import { setMangasHistory } from "@/features/user-settings/HistorySlice"
import DotLoaderComponent from "@/components/global/DotLoader"
import { GetAllMangasBookmarks, getAllMangasBookmarks } from "@/lib/getServerSideProps/getAllMangasBookmarks"
import { getAllPopularMangas } from "@/lib/getServerSideProps/getAllPopularMangas"
import { GetAllMangasHistory, getAllMangasHistory } from "@/lib/getServerSideProps/getAllMangasHistory"
import { GetAllMangasChart, getAllMangasChart } from "@/lib/getServerSideProps/getAllMangasChart"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/user"
const DynamicBookmarks = dynamic(() => import("@/components/user-settings/bookmarks/Bookmarks"), {
  loading: () => <DotLoaderComponent size={40} />
})
const DynamicHistory = dynamic(() => import("@/components/user-settings/history/History"), {
  loading: () => <DotLoaderComponent size={40} />
})
const DynamicAccount = dynamic(() => import("@/components/user-settings/account/Account"), {
  loading: () => <DotLoaderComponent size={40} />
})
const DynamicAddManga = dynamic(() => import("@/components/user-settings/add-manga/AddManga"), {
  loading: () => <DotLoaderComponent size={40} />
})
const DynamicChart = dynamic(() => import("@/components/user-settings/chart/Chart"), {
  loading: () => <DotLoaderComponent size={40} />
})
const DynamicMangasBoxesPopular = dynamic(() => import("@/components/global/popularMangas/manga-boxes"))

export const getServerSideProps: GetServerSideProps<{ popularMangasRes: MangasResponse, bookmarkRes: MangasResponse, historyRes: HistoryResponse, userRes: UserResponse, chartRes: ChartResponse }> = async ({ req, query }) => {
  await dbConnect()
  let { pageChart, pageBookmark, pageHistory, nameBookmark, nameChart, nameHistory, time } = query
  const { _id } = req.headers
  if (!_id) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  } else {

    pageChart = pageChart ?? "1"
    pageBookmark = pageBookmark ?? "1"
    pageHistory = pageHistory ?? "1"
    nameBookmark = nameBookmark ?? ""
    nameHistory = nameHistory ?? ""
    nameChart = nameChart ?? ""
    time = time ?? "oneWeek"
    const user = await User.findById(_id)
    const [popularMangas, { bookmarkMangas, bookmarkMangasLength }, { historyMangas, historyMangasLength }] = await Promise.all([
      getAllPopularMangas(),
      getAllMangasBookmarks({ pageBookmark, nameBookmark, bookmarks: user.bookmarks } as GetAllMangasBookmarks),
      getAllMangasHistory({ pageHistory, nameHistory, history: user.history } as GetAllMangasHistory)
    ])
    const popularMangasRes = JSON.parse(JSON.stringify({
      message: "Fetched Popular Mangas",
      data: popularMangas
    }))
    const bookmarkRes = JSON.parse(JSON.stringify({
      message: "Fetched Bookmark Mangas",
      data: bookmarkMangas,
      length: bookmarkMangasLength
    }))
    const historyRes = JSON.parse(JSON.stringify({
      message: "Fetched History Mangas",
      data: historyMangas,
      length: historyMangasLength
    }))
    let chartRes = JSON.parse(JSON.stringify({
      message: "User Unverified",
      data: [],
      length: 0
    }))
    const userRes = JSON.parse(JSON.stringify({
      message: "Fetched User",
      data: user
    }))
    const { chartMangas, chartMangasLength, trendingManga } = await getAllMangasChart({ time, pageChart, nameChart } as GetAllMangasChart)
    chartRes = JSON.parse(JSON.stringify({
      message: "Fetched Chart Mangas",
      data: chartMangas,
      length: chartMangasLength,
      trendingManga
    }))
    console.log("🚀 ~ file: user-settings.tsx:58 ~ popularMangasRes.message:", popularMangasRes.message)
    console.log("🚀 ~ file: user-settings.tsx:64 ~ bookmarkRes.message:", bookmarkRes.message)
    console.log("🚀 ~ file: user-settings.tsx:70 ~ historyRes.message:", historyRes.message)
    console.log("🚀 ~ file: user-settings.tsx:76 ~ chartRes.message:", chartRes.message)
    console.log("🚀 ~ file: user-settings.tsx:81 ~ userRes.message:", userRes.message)
    return {
      props: {
        popularMangasRes, bookmarkRes, historyRes, chartRes, userRes
      }
    }
  }
}

const Page = ({ popularMangasRes, bookmarkRes, historyRes, userRes, chartRes }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const userSettingsState = useSelector(selectUserSettingsState)
  const dispatch = useDispatch()
  const bookmarkState = useSelector(selectBookmarkState)
  const userState = useSelector(selectUserState)
  // set mangas bookmark
  useEffect(() => {
    if (bookmarkRes.data) {
      dispatch(setMangasBookmark({ mangas: bookmarkRes.data, length: bookmarkRes.length as number }))
    }
  }, [dispatch, bookmarkRes])
  // set user
  useEffect(() => {
    if (userRes.data) {
      dispatch(setUser(userRes.data))
    }
  }, [dispatch, userRes])
  useEffect(() => {
    if (chartRes.data) {
      dispatch(setMangasChart({ mangas: chartRes.data, length: chartRes.length as number }))
    }
  }, [dispatch, chartRes])
  // set history mangas
  useEffect(() => {
    if (historyRes.data) {
      dispatch(setMangasHistory({ mangas: historyRes.data, length: historyRes.length as number }))
    }
  }, [dispatch, historyRes])
  const title = useMemo(() => {
    let currentTab = "Cài đặt"
    if (userSettingsState.menu === "account") {
      currentTab = "Cài đặt"
    } else if (userSettingsState.menu === "bookmarks") {
      currentTab = "Tủ truyện"
    } else if (userSettingsState.menu === "addManga") {
      currentTab = "Tạo truyện"
    } else if (userSettingsState.menu === "chart") {
      currentTab = "Thống kê"
    } else if (userSettingsState.menu === "history") {
      currentTab = "Lịch sử đọc truyện"
    }
    return `${userState.username} - ${currentTab}`
  }, [userState.username, userSettingsState.menu])
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <UserMenu user={userState} />
      <BodyBox>
        <div className="basis-9/12">
          <p className="text-2xl font-bold">Cài Đặt Của {userState.username}</p>
          <hr className="my-2" />
          <div className="flex flex-col py-5 sm:flex-row gap-y-6 pb-8">
            <div className="flex flex-col basis-1/4">
              <MenuTab isActive={userSettingsState.menu === "bookmarks"} handleOnClick={() => dispatch(setMenu("bookmarks"))}>
                <svg className={`${userSettingsState.menu === "bookmarks" ? "fill-white" : "group-hover:fill-second-green dark:group-hover:fill-main-green dark:fill-neutral-100"} h-4`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z" /></svg>
                <span>Tủ truyện</span>
              </MenuTab>
              <MenuTab isActive={userSettingsState.menu === "account"} handleOnClick={() => dispatch(setMenu("account"))}>
                <svg className={`${userSettingsState.menu === "account" ? "fill-white" : "group-hover:fill-second-green dark:group-hover:fill-main-green dark:fill-neutral-100"} h-4`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg>
                <span>Tài khoản</span>
              </MenuTab>
              <MenuTab isActive={userSettingsState.menu === "history"} handleOnClick={() => dispatch(setMenu("history"))}>
                <svg className={`${userSettingsState.menu === "history" ? "fill-white" : "group-hover:fill-second-green dark:group-hover:fill-main-green dark:fill-neutral-100"} h-4`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M75 75L41 41C25.9 25.9 0 36.6 0 57.9V168c0 13.3 10.7 24 24 24H134.1c21.4 0 32.1-25.9 17-41l-30.8-30.8C155 85.5 203 64 256 64c106 0 192 86 192 192s-86 192-192 192c-40.8 0-78.6-12.7-109.7-34.4c-14.5-10.1-34.4-6.6-44.6 7.9s-6.6 34.4 7.9 44.6C151.2 495 201.7 512 256 512c141.4 0 256-114.6 256-256S397.4 0 256 0C185.3 0 121.3 28.7 75 75zm181 53c-13.3 0-24 10.7-24 24V256c0 6.4 2.5 12.5 7 17l72 72c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-65-65V152c0-13.3-10.7-24-24-24z" /></svg>
                <span>Lịch sử</span>
              </MenuTab>
              {userState.role === "admin" && (
                <MenuTab isActive={userSettingsState.menu === "addManga"} handleOnClick={() => dispatch(setMenu("addManga"))}>
                  <svg className={`${userSettingsState.menu === "addManga" ? "fill-white" : "group-hover:fill-second-green dark:group-hover:fill-main-green dark:fill-neutral-100"} h-4`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z" /></svg>
                  <span>Tạo truyện</span>
                </MenuTab>
              )}
              {userState.role === "admin" && (
                <MenuTab isActive={userSettingsState.menu === "chart"} handleOnClick={() => dispatch(setMenu("chart"))}>
                  <svg className={`${userSettingsState.menu === "chart" ? "fill-white" : "group-hover:fill-second-green dark:group-hover:fill-main-green dark:fill-neutral-100"} h-4`} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M32 32c17.7 0 32 14.3 32 32V400c0 8.8 7.2 16 16 16H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H80c-44.2 0-80-35.8-80-80V64C0 46.3 14.3 32 32 32zM160 224c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V256c0-17.7 14.3-32 32-32zm128-64V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V160c0-17.7 14.3-32 32-32s32 14.3 32 32zm64 32c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V224c0-17.7 14.3-32 32-32zM480 96V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V96c0-17.7 14.3-32 32-32s32 14.3 32 32z" /></svg>
                  <span>Thống kê</span>
                </MenuTab>
              )}
            </div>
            <div className="basis-3/4">
              {userSettingsState.menu === "bookmarks" ? (
                <DynamicBookmarks mangas={bookmarkState.mangas} mangasLength={bookmarkState.length} />
              ) : userSettingsState.menu === "account" ? (
                <DynamicAccount user={userState} />
              ) : userSettingsState.menu === "history" ? (
                <DynamicHistory />
              ) : userSettingsState.menu === "addManga" ? (
                <DynamicAddManga />
              ) : (
                <DynamicChart />
              )}
            </div>
          </div>
        </div>
        <DynamicMangasBoxesPopular mangas={popularMangasRes.data} />
      </BodyBox>
    </>
  )
}

export default Page