import { ChartResponse, MangasResponse, UserResponse } from "@/type"
import MangaBoxes from "@/components/mangas/manga-boxes"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import BodyBox from "@/components/global/body-box"
import UserMenu from "@/components/global/user-menu"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { setPageMangas } from "@/features/manga/MangasSlice"
import { selectUserState, setUser } from "@/features/UserSlice"
import dynamic from "next/dynamic"
import { getAllPopularMangas } from "@/lib/getServerSideProps/getAllPopularMangas"
import { getUser } from "@/lib/getServerSideProps/getUser"
import { GetALlMangas, getAllMangas } from "@/lib/getServerSideProps/getAllMangas"
import dbConnect from "@/lib/dbConnect"
import Slick from "@/components/global/slick/slick"
import { getAllMangasChart } from "@/lib/getServerSideProps/getAllMangasChart"
import TrendingManga from "@/components/home/trending-manga"
const DynamicMangasBoxesPopular = dynamic(() => import("@/components/global/popularMangas/manga-boxes"))

export const getServerSideProps: GetServerSideProps<{ mangasRes: MangasResponse, popularMangasRes: MangasResponse, userRes: UserResponse, chartRes: ChartResponse }> = async ({ query, req }) => {
  await dbConnect()
  let { page, sort } = query
  page = page ?? "1"
  sort = sort ?? "latest"
  const { _id } = req.headers
  console.log("🚀 ~ file: index.tsx:25 ~ _id:", _id)
  const [{ mangasLength, mangas }, popularMangas, user, { chartMangas, chartMangasLength, trendingManga }] = await Promise.all([
    getAllMangas({ page, sort } as GetALlMangas),
    getAllPopularMangas(),
    getUser(_id as string),
    getAllMangasChart({ time: "oneDay", nameChart: "", pageChart: "1" })
  ])
  const mangasRes = JSON.parse(JSON.stringify({
    message: "Fetched Mangas",
    length: mangasLength,
    data: mangas,
  }))
  const popularMangasRes = JSON.parse(JSON.stringify({
    message: "Fetched Popular Mangas",
    data: popularMangas
  }))
  const userRes = JSON.parse(JSON.stringify({
    message: "Fetched User",
    data: user
  }))
  const chartRes = JSON.parse(JSON.stringify({
    message: "Fetched Slick",
    data: chartMangas,
    trendingManga: trendingManga
  }))
  console.log("🚀 ~ file: index.tsx:42 ~ mangasRes.message:", mangasRes.message)
  console.log("🚀 ~ file: index.tsx:47 ~ popularMangasRes.message:", popularMangasRes.message)
  console.log("🚀 ~ file: index.tsx:52 ~ userRes.message:", userRes.message)
  console.log("🚀 ~ file: index.tsx:51 ~ chartRes.message:", chartRes.message)
  return {
    props: {
      mangasRes: mangasRes as any, popularMangasRes: popularMangasRes as any, userRes
        : userRes as any, chartRes: chartRes as any
    }
  }
}

const Page = ({ mangasRes, popularMangasRes, userRes, chartRes }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const dispatch = useDispatch()
  const userState = useSelector(selectUserState)
  // set page
  useEffect(() => {
    dispatch(setPageMangas(1))
  }, [dispatch])
  // set user
  useEffect(() => {
    // console.log("🚀 ~ file: index.tsx:63 ~ useEffect ~ userRes:", userRes)
    if (userRes.data) {
      dispatch(setUser(userRes.data))
    }
  }, [dispatch, userRes])
  return (
    <>
      <UserMenu user={userState} />
      <Head>
        <title>Mangaclash - Đọc Truyện online</title>
      </Head>
      <BodyBox className="pt-0">
        {/* left row */}
        <div className="basis-9/12">
          <div className="flex flex-row max-w-fit -mx-4 md:mx-auto mb-4">
            <Slick mangas={chartRes.data} />
            <TrendingManga manga={chartRes.trendingManga!} />
          </div>
          <h2 className="mb-2 text-lg font-bold uppercase">ĐỌC TRUYỆN MỚI CẬP NHẬT</h2>
          <hr />
          {mangasRes.data ? (
            <MangaBoxes mangas={mangasRes.data} mangasLength={mangasRes.length} />
          ) : (
            <p className="mt-8 font-medium text-center">Không có bộ truyện nào, vui lòng tạo truyện</p>
          )}
        </div>
        {/* right row */}
        <DynamicMangasBoxesPopular mangas={popularMangasRes.data} />
      </BodyBox >
    </>
  )
}


// TODO: add page count read in bottom in single page read, add search page link to responsive menu and fix navigation to break line and refactoring hooks (local storage)

export default Page;