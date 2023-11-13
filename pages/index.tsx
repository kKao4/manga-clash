import { MangasResponse, UserResponse } from "@/type"
import MangaBoxes from "@/components/mangas/manga-boxes"
// import MangasBoxesPopular from "@/components/global/popularMangas/manga-boxes"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import BodyBox from "@/components/global/body-box"
import UserMenu from "@/components/global/user-menu"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { setPageMangas } from "@/features/manga/MangasSlice"
import { selectUserState, setUser } from "@/features/UserSlice"
import dynamic from "next/dynamic"
const DynamicMangasBoxesPopular = dynamic(() => import("@/components/global/popularMangas/manga-boxes"), {
  loading: () => <p>Loading...</p>
})

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
  console.log("🚀 ~ file: index.tsx:25~ user.message:", user.message)
  console.log("🚀 ~ file: index.tsx:25~ popularMangas.message:", popularMangas.message)
  console.log("🚀 ~ file: index.tsx:25~ mangas.message:", mangas.message)
  return { props: { mangas, popularMangas, user } }
}

const Page = ({ mangas, popularMangas, user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const dispatch = useDispatch()
  const userState = useSelector(selectUserState)
  // set page
  useEffect(() => {
    dispatch(setPageMangas(1))
  }, [dispatch])
  // set user
  useEffect(() => {
    if (user.data) {
      dispatch(setUser(user.data))
    }
  }, [dispatch, user])
  return (
    <>
      <UserMenu user={userState} />
      <Head>
        <title>Mangaclash - Đọc Truyện online</title>
      </Head>
      <BodyBox>
        {/* left row */}
        <div className="basis-9/12">
          <h2 className="mb-2 text-lg font-bold uppercase">ĐỌC TRUYỆN MỚI CẬP NHẬT</h2>
          <hr />
          {mangas.data ? (
            <MangaBoxes mangas={mangas.data} mangasLength={mangas.length} />
          ) : (
            <p className="mt-8 font-medium text-center">Không có bộ truyện nào, vui lòng tạo truyện</p>
          )}
        </div>
        {/* right row */}
        <DynamicMangasBoxesPopular mangas={popularMangas.data} />
      </BodyBox >
    </>
  )
}

export default Page;