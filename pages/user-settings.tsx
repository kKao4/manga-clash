import BodyBox from "@/components/global/body-box"
import { ChartResponse, HistoryMangasResponse, MangasResponse, UserResponse } from "@/type"
import { InferGetServerSidePropsType, GetServerSideProps } from "next"
import Head from "next/head"
import { useEffect } from "react"
import Menu from "@/components/user-settings/menu"
import { useSelector, useDispatch } from "react-redux"
import { selectUserSettingsState, setMenu } from "@/features/user-settings/UserSettingsSlice"
import UserMenu from "@/components/global/user-menu"
import dynamic from "next/dynamic"
import { selectUserState, setUser } from "@/features/UserSlice"
import { setMangasBookmark, selectBookmarkState } from "@/features/user-settings/BookmarkSlice"
import { setMangasChart } from "@/features/user-settings/ChartSlice"
import { setMangasHistory } from "@/features/user-settings/HistorySlice"
import DotLoaderComponent from "@/components/global/dot-loader"
const DynamicBookmarks = dynamic(() => import("@/components/user-settings/bookmarks/bookmarks"), {
  loading: () => <DotLoaderComponent size={40} />
})
const DynamicHistory = dynamic(() => import("@/components/user-settings/history/history"), {
  loading: () => <DotLoaderComponent size={40} />
})
const DynamicAccount = dynamic(() => import("@/components/user-settings/account/account"), {
  loading: () => <DotLoaderComponent size={40} />
})
const DynamicAddManga = dynamic(() => import("@/components/user-settings/add-manga/add-manga"), {
  loading: () => <DotLoaderComponent size={40} />
})
const DynamicChart = dynamic(() => import("@/components/user-settings/chart/chart"), {
  loading: () => <DotLoaderComponent size={40} />
})
const DynamicMangasBoxesPopular = dynamic(() => import("@/components/global/popularMangas/manga-boxes"))

export const getServerSideProps: GetServerSideProps<{ popularMangas: MangasResponse, mangas: MangasResponse, history: HistoryMangasResponse, user: UserResponse, chart: ChartResponse }> = async (context) => {
  const token = context.req.cookies.token
  let { pageChart, pageBookmark, pageHistory, nameBookmark, nameChart, nameHistory, time } = context.query
  pageChart = pageChart ?? "1"
  pageBookmark = pageBookmark ?? "1"
  pageHistory = pageHistory ?? "1"
  nameBookmark = nameBookmark ?? ""
  nameChart = nameChart ?? ""
  nameHistory = nameHistory ?? ""
  time = time ?? "oneWeek"
  const [popularMangasRes, mangasRes, historyRes, userRes, chartRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/popular_mangas`),
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/user/all_mangas_bookmarks?token=${token}&sort=latest&pageBookmark=${pageBookmark}&nameBookmark=${nameBookmark}`),
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/user/history?token=${token}&pageHistory=${pageHistory}&nameHistory=${nameHistory}`),
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/user/account?token=${token}`),
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/admin/chart?token=${token}&time=${time}&pageChart=${pageChart}&nameChart=${nameChart}`)
  ])
  const [popularMangas, mangas, history, user, chart] = await Promise.all([popularMangasRes.json(), mangasRes.json(), historyRes.json(), userRes.json(), chartRes.json()])
  console.log("🚀 ~ file: user-settings.tsx:28 ~ user.message:", user.message)
  console.log("🚀 ~ file: user-settings.tsx:28 ~ mangas.message:", mangas.message)
  console.log("🚀 ~ file: user-settings.tsx:28 ~ history.message:", history.data)
  console.log("🚀 ~ file: user-settings.tsx:28 ~ popularMangas.message:", popularMangas.message)
  console.log("🚀 ~ file: user-settings.tsx:31 ~ chart:", chart.message)
  if (!user.data) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }
  return { props: { popularMangas, mangas, history, user, chart } }
}

const Page = ({ popularMangas, mangas, history, user, chart }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const userSettingsState = useSelector(selectUserSettingsState)
  const dispatch = useDispatch()
  const bookmarkState = useSelector(selectBookmarkState)
  const userState = useSelector(selectUserState)
  // set mangas bookmark
  useEffect(() => {
    if (mangas.data) {
      dispatch(setMangasBookmark({ mangas: mangas.data, length: mangas.length as number }))
    }
  }, [dispatch, mangas])
  // set user
  useEffect(() => {
    if (user.data) {
      dispatch(setUser(user.data))
    }
  }, [dispatch, user])
  useEffect(() => {
    if (chart.data) {
      dispatch(setMangasChart(chart.data))
    }
  }, [dispatch, chart])
  // set history mangas
  useEffect(() => {
    if (history.data) {
      dispatch(setMangasHistory({ mangas: history.data, length: history.length as number }))
    }
  }, [dispatch, history])
  const title = `${userState.username} - Cài đặt`
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
          <div className="flex flex-col py-5 sm:flex-row gap-y-6">
            <div className="flex flex-col basis-1/4">
              <Menu isActive={userSettingsState.menu === "bookmarks"} handleOnClick={() => dispatch(setMenu("bookmarks"))}>
                <svg className={`${userSettingsState.menu === "bookmarks" ? "fill-white" : "group-hover:fill-second-green"} h-4`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z" /></svg>
                <span>Tủ truyện</span>
              </Menu>
              <Menu isActive={userSettingsState.menu === "account"} handleOnClick={() => dispatch(setMenu("account"))}>
                <svg className={`${userSettingsState.menu === "account" ? "fill-white" : "group-hover:fill-second-green"} h-4`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg>
                <span>Tài khoản</span>
              </Menu>
              <Menu isActive={userSettingsState.menu === "history"} handleOnClick={() => dispatch(setMenu("history"))}>
                <svg className={`${userSettingsState.menu === "history" ? "fill-white" : "group-hover:fill-second-green"} h-4`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M75 75L41 41C25.9 25.9 0 36.6 0 57.9V168c0 13.3 10.7 24 24 24H134.1c21.4 0 32.1-25.9 17-41l-30.8-30.8C155 85.5 203 64 256 64c106 0 192 86 192 192s-86 192-192 192c-40.8 0-78.6-12.7-109.7-34.4c-14.5-10.1-34.4-6.6-44.6 7.9s-6.6 34.4 7.9 44.6C151.2 495 201.7 512 256 512c141.4 0 256-114.6 256-256S397.4 0 256 0C185.3 0 121.3 28.7 75 75zm181 53c-13.3 0-24 10.7-24 24V256c0 6.4 2.5 12.5 7 17l72 72c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-65-65V152c0-13.3-10.7-24-24-24z" /></svg>
                <span>Lịch sử</span>
              </Menu>
              {userState.role === "admin" && (
                <Menu isActive={userSettingsState.menu === "addManga"} handleOnClick={() => dispatch(setMenu("addManga"))}>
                  <svg className={`${userSettingsState.menu === "addManga" ? "fill-white" : "group-hover:fill-second-green"} h-4`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z" /></svg>
                  <span>Tạo truyện</span>
                </Menu>
              )}
              {userState.role === "admin" && (
                <Menu isActive={userSettingsState.menu === "chart"} handleOnClick={() => dispatch(setMenu("chart"))}>
                  <svg className={`${userSettingsState.menu === "chart" ? "fill-white" : "group-hover:fill-second-green"} h-4`} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M32 32c17.7 0 32 14.3 32 32V400c0 8.8 7.2 16 16 16H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H80c-44.2 0-80-35.8-80-80V64C0 46.3 14.3 32 32 32zM160 224c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V256c0-17.7 14.3-32 32-32zm128-64V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V160c0-17.7 14.3-32 32-32s32 14.3 32 32zm64 32c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V224c0-17.7 14.3-32 32-32zM480 96V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V96c0-17.7 14.3-32 32-32s32 14.3 32 32z" /></svg>
                  <span>Thống kê</span>
                </Menu>
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
        <DynamicMangasBoxesPopular mangas={popularMangas.data} />
      </BodyBox>
    </>
  )
}

export default Page