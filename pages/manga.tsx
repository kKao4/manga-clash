import MenuFoot from "@/components/mangas/menu-foot";
// import MangasBoxesPopular from "@/components/global/popularMangas/manga-boxes";
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
import { addSearchTags, resetSearchTags } from "@/features/search/SearchSlice";
import { setSort } from "@/features/GlobalSlice";
import dynamic from "next/dynamic"
import DotLoaderComponent from "@/components/global/dot-loader";
const DynamicMangasBoxesPopular = dynamic(() => import("@/components/global/popularMangas/manga-boxes"), {
  loading: () => <DotLoaderComponent size={40} heightIsFull={false} />
})


export const getServerSideProps: GetServerSideProps<{ mangas: MangasResponse, popularMangas: MangasResponse, user: UserResponse }> = async (context) => {
  let { page, sort, tags } = context.query;
  sort = sort ?? "latest";
  page = page ?? "1";
  tags = tags ?? ""
  const [mangasRes, popularMangasRes, userRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/all_mangas?page=${page}&sort=${sort}&tags=${tags}`),
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
      dispatch(addSearchTags(router.query.tags as string))
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
          <h2 className="mb-6 text-lg font-bold capitalize">Tất Cả Các Bộ Truyện {mangas.tags ? `Thể Loại "${mangas.tags}"` : ""}</h2>
          <OrderNavigation mangasLength={mangas.length} search={false} searchValue={mangas.search} />
          {/* mangas loop */}
          <MangaBoxes mangas={mangas.data} mangasLength={mangas.length} />
        </div>
        {/* right row */}
        <DynamicMangasBoxesPopular mangas={popularMangas.data} />
      </BodyBox>
    </>
  )
}

export default Page;