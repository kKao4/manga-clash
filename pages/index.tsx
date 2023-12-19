import { ChartResponse, MangasResponse, UserResponse } from "@/type"
import MangaBoxes from "@/components/mangas/MangaBoxes"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import BodyBox from "@/components/global/box/BodyBox"
import UserMenu from "@/components/global/userMenu/UserMenu"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { setPageMangas } from "@/features/manga/MangasSlice"
import { selectUserState, setUser } from "@/features/UserSlice"
import { getAllPopularMangas } from "@/lib/getServerSideProps/getAllPopularMangas"
import { getUser } from "@/lib/getServerSideProps/getUser"
import { GetALlMangas, getAllMangas } from "@/lib/getServerSideProps/getAllMangas"
import dbConnect from "@/lib/dbConnect"
import Slick from "@/components/home/Slick"
import { getAllMangasChart } from "@/lib/getServerSideProps/getAllMangasChart"
import TrendingManga from "@/components/home/TrendingManga"
import MangasBoxesPopular from "@/components/global/popularMangas/manga-boxes"

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
    getAllMangasChart({ time: "oneDay", nameChart: "", pageChart: "1", num: 8 })
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
        <title>Manga-kKao4 - Đọc Truyện online</title>
      </Head>
      <BodyBox className="pt-4">
        {/* left row */}
        <div className="basis-9/12">
          {/* slick and trending manga */}
          <div className="flex flex-row mb-4 -mx-4 max-w-fit md:mx-auto">
            <Slick mangas={chartRes.data} />
            <TrendingManga manga={chartRes.trendingManga!} />
          </div>
          <h2 className="mb-2 text-lg font-bold uppercase">ĐỌC TRUYỆN MỚI CẬP NHẬT</h2>
          <hr className="dark:border-neutral-700" />
          {mangasRes.data ? (
            <MangaBoxes mangas={mangasRes.data} mangasLength={mangasRes.length} />
          ) : (
            <p className="mt-8 font-medium text-center">Không có bộ truyện nào, vui lòng tạo truyện</p>
          )}
        </div>
        {/* right row */}
        <MangasBoxesPopular mangas={popularMangasRes.data} />
      </BodyBox >
    </>
  )
}

export default Page;