import MenuFoot from "@/components/mangas/menu-foot";
import { MangasResponse, UserResponse } from "@/type";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import MangaBoxes from "@/components/mangas/manga-boxes";
import Head from "next/head";
import OrderNavigation from "@/components/global/order-navigation";
import BodyBox from "@/components/global/body-box";
import UserMenu from "@/components/global/user-menu";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router"
import { setPageMangas } from "@/features/manga/MangasSlice";
import { setUser, selectUserState } from "@/features/UserSlice";
import { resetSearchTags, selectSearchState, setSearchTags } from "@/features/search/SearchSlice";
import { setSort } from "@/features/GlobalSlice";
import dynamic from "next/dynamic"
import { GetALlMangas, getAllMangas } from "@/lib/getServerSideProps/getAllMangas";
import { getAllPopularMangas } from "@/lib/getServerSideProps/getAllPopularMangas";
import { getUser } from "@/lib/getServerSideProps/getUser";
import dbConnect from "@/lib/dbConnect";
const DynamicMangasBoxesPopular = dynamic(() => import("@/components/global/popularMangas/manga-boxes"))

export const getServerSideProps: GetServerSideProps<{ mangasRes: MangasResponse, popularMangasRes: MangasResponse, userRes: UserResponse }> = async ({ req, query }) => {
  await dbConnect()
  let { page, sort, tags } = query
  const { _id } = req.headers
  page = page ?? "1"
  sort = sort ?? "latest"
  tags = tags ?? []
  const [{ mangas, mangasLength }, popularMangas, user] = await Promise.all([
    getAllMangas({ page, sort, tags } as GetALlMangas),
    getAllPopularMangas(),
    getUser(_id as string)
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
  console.log("🚀 ~ file: manga.tsx:27 ~ userRes.message:", userRes.message)
  console.log("🚀 ~ file: manga.tsx:27 ~ popularMangasRes.message:", popularMangasRes.message)
  console.log("🚀 ~ file: manga.tsx:27 ~ mangasRes.message:", mangasRes.message)
  return { props: { mangasRes, popularMangasRes, userRes } }
}

const Page = ({ mangasRes, popularMangasRes, userRes }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const userState = useSelector(selectUserState)
  const searchState = useSelector(selectSearchState)
  // set user
  useEffect(() => {
    if (userRes.data) {
      dispatch(setUser(userRes.data))
    }
  }, [dispatch, userRes])
  // set page
  useEffect(() => {
    if (router.query.page) {
      dispatch(setPageMangas(Number(router.query.page)))
    } else {
      dispatch(setPageMangas(1))
    }
  }, [dispatch, router.query.page])
  // set sort
  useEffect(() => {
    if (router.query.sort) {
      dispatch(setSort(router.query.sort as any))
    } else {
      dispatch(setSort("latest"))
    }
  }, [dispatch, router.query.sort])
  // set tags
  useEffect(() => {
    if (router.query.tags) {
      dispatch(setSearchTags(router.query.tags as string))
    } else {
      dispatch(resetSearchTags())
    }
  }, [dispatch, router.query.tags])
  return (
    <>
      <UserMenu user={userState} />
      <Head>
        <title>Danh Sách Tất Cả Các Bộ Truyện</title>
      </Head>
      <MenuFoot />
      <BodyBox>
        {/* left row */}
        <div className="basis-9/12">
          <h2 className="mb-4 text-lg font-bold capitalize">Tất Cả Các Bộ Truyện {router.query.tags ? `Thể Loại "${router.query.tags}"` : ""}</h2>
          <OrderNavigation mangasLength={mangasRes.length} search={false} />
          {/* mangas loop */}
          <MangaBoxes mangas={mangasRes.data} mangasLength={mangasRes.length} />
        </div>
        {/* right row */}
        <DynamicMangasBoxesPopular mangas={popularMangasRes.data} />
      </BodyBox>
    </>
  )
}

export default Page;