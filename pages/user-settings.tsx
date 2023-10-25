import BodyBox from "@/components/global/body-box"
import MangasBoxesPopular from "@/components/global/popularMangas/manga-boxes"
import { ChartResponse, MangasResponse, UserResponse } from "@/type"
import { InferGetServerSidePropsType, GetServerSideProps } from "next"
import Head from "next/head"
import { useEffect } from "react"
import Menu from "@/components/user-settings/menu"
import Bookmarks from "@/components/user-settings/bookmarks/bookmarks"
import { useSelector, useDispatch } from "react-redux"
import { selectUserSettingsState, setMenu } from "@/features/user-settings/UserSettingsSlice"
import Account from "@/components/user-settings/account/account"
import UserMenu from "@/components/global/user-menu"
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import { selectUserState, setUser } from "@/features/UserSlice"
import { setMangasBookmark, selectBookmarkState, setSearchName, setPageBookmark } from "@/features/user-settings/BookmarkSlice"
import { selectChartState, setMangasChart, setPageChart } from "@/features/user-settings/ChartSlice"
const DynamicAddManga = dynamic(() => import("@/components/user-settings/add-manga/add-manga"), {
  ssr: false,
  loading: () => <p>Loading...</p>
})
const DynamicChart = dynamic(() => import("@/components/user-settings/chart/chart"), {
  ssr: false,
  loading: () => <p>Loading...</p>
})

export const getServerSideProps: GetServerSideProps<{ popularMangas: MangasResponse, mangas: MangasResponse, user: UserResponse, chart: ChartResponse }> = async (context) => {
  const token = context.req.cookies.token
  let { pageChart, pageBookmark, name, time } = context.query
  pageChart = pageChart ?? "1"
  pageBookmark = pageBookmark ?? "1"
  name = name ?? ""
  time = time ?? "oneWeek"
  const [popularMangasRes, mangasRes, userRes, chartRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/popular_mangas`),
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/user/all_mangas_bookmarks?token=${token}&sort=latest&page=${pageBookmark}&name=${name}`),
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/user/account?token=${token}`),
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/admin/chart?token=${token}&time=${time}&page=${pageChart}&name=${name}`)
  ])
  const [popularMangas, mangas, user, chart] = await Promise.all([popularMangasRes.json(), mangasRes.json(), userRes.json(), chartRes.json()])
  console.log("🚀 ~ file: user-settings.tsx:28 ~ user.message:", user.message)
  console.log("🚀 ~ file: user-settings.tsx:28 ~ mangas.message:", mangas.message)
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
  return { props: { popularMangas, mangas, user, chart } }
}

const Page = ({ popularMangas, mangas, user, chart }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const userSettingsState = useSelector(selectUserSettingsState)
  const dispatch = useDispatch()
  const router = useRouter()
  const bookmarkState = useSelector(selectBookmarkState)
  const chartState = useSelector(selectChartState)
  const userState = useSelector(selectUserState)
  // set mangas bookmark
  useEffect(() => {
    if (mangas.data) {
      dispatch(setMangasBookmark({ mangas: mangas.data, length: mangas.length }))
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
  // set page bookmark
  useEffect(() => {
    if (router.query.pageBookmark) {
      dispatch(setPageBookmark(Number(router.query.pageBookmark)))
    } else {
      dispatch(setPageBookmark(1))
    }
  }, [dispatch, router.query.pageBookmark])
  // set page chart 
  useEffect(() => {
    if (router.query.pageChart) {
      dispatch(setPageChart(Number(router.query.pageChart)))
    } else {
      dispatch(setPageChart(1))
    }
  }, [router.query.pageChart, dispatch])
  // set name
  useEffect(() => {
    if (router.query.name && typeof router.query.name === "string") {
      dispatch(setSearchName(router.query.name))
    }
  }, [dispatch, router])
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
                <Bookmarks mangas={bookmarkState.mangas} mangasLength={bookmarkState.length} />
              ) : userSettingsState.menu === "account" ? (
                <Account user={userState} />
              ) : userSettingsState.menu === "addManga" ? (
                <DynamicAddManga />
              ) : (
                <DynamicChart />
              )}
            </div>
          </div>
        </div>
        <MangasBoxesPopular mangas={popularMangas.data} />
      </BodyBox>
    </>
  )
}

export default Page