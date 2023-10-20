import MenuFoot from "@/components/mangas/menu-foot";
import MangasBoxesPopular from "@/components/global/popularMangas/manga-boxes";
import {  MangasResponse, UserResponse } from "@/type";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import MangaBoxes from "@/components/mangas/manga-boxes";
import Head from "next/head";
import OrderNavigation from "@/components/global/order-navigation";
import BodyBox from "@/components/global/body-box";
import UserMenu from "@/components/global/user-menu";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router"
import { selectMangasState, setPageMangas } from "@/features/manga/MangasSlice";
import { setUser, selectUserState } from "@/features/UserSlice";

export const getServerSideProps: GetServerSideProps<{ mangas: MangasResponse, popularMangas: MangasResponse, user: UserResponse }> = async (context) => {
  let { page, sort } = context.query;
  sort = sort ?? "latest";
  page = page ?? "1";
  const [mangasRes, popularMangasRes, userRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/all_mangas?page=${page}&sort=${sort}`),
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/popular_mangas`),
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/user/account?token=${context.req.cookies.token}`)
  ])
  const [mangas, popularMangas, user] = await Promise.all([mangasRes.json(), popularMangasRes.json(), userRes.json()])
  console.log("🚀 ~ file: manga.tsx:27 ~ user.message:", user.message)
  console.log("🚀 ~ file: manga.tsx:27 ~ popularMangas.message:", popularMangas.message)
  console.log("🚀 ~ file: manga.tsx:27 ~ mangas.message:", mangas.message)
  return { props: { mangas, popularMangas, user } }
}

const Page = ({ mangas, popularMangas, user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const mangasState = useSelector(selectMangasState)
  const dispatch = useDispatch()
  const router = useRouter()
  const userState = useSelector(selectUserState)
  // set user state
  useEffect(() => {
    if (user.data) {
      dispatch(setUser(user.data))
    }
  }, [dispatch, user])
  // set page paginate
  useEffect(() => {
    if (router.query.page) {
      dispatch(setPageMangas(Number(router.query.page)))
    } else {
      dispatch(setPageMangas(1))
    }
  }, [dispatch, router.query.page])
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
          <h2 className="mb-6 text-lg font-bold">Tất Cả Các Bộ Truyện</h2>
          <OrderNavigation mangasLength={mangas.length} search={false} searchValue={mangas.search} />
          {/* mangas loop */}
          <MangaBoxes mangas={mangas.data} mangasLength={mangas.length} />
        </div>
        {/* right row */}
        <MangasBoxesPopular mangas={popularMangas.data} />
      </BodyBox>
    </>
  )
}

export default Page;