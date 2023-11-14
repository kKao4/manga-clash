import { MangaResponse, MangasResponse, UserRatingResponse, UserResponse } from "@/type";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import Navigation from "@/components/global/navigation";
import MenuFootBox from "@/components/global/menu-foot-box";
import BodyBox from "@/components/global/body-box";
import { useRef, useState } from "react"
import UserMenu from "@/components/global/user-menu";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { MangaType } from "@/models/manga";
import { setUser, selectUserState } from "@/features/UserSlice";
import { selectMangaState, addOrUpdateManga } from "@/features/mangaHref/MangaSlice";
import { setUserRating } from "@/features/mangaHref/UserRatingSlice";
import ImageAndDetailManga from "@/components/mangaHref/image-and-detail-manga";
import Name from "@/components/mangaHref/name";
import { RootState } from "@/store";
import dynamic from "next/dynamic";
import dbConnect from "@/lib/dbConnect";
import { getAllPopularMangas } from "@/lib/getServerSideProps/getAllPopularMangas";
import { getUser } from "@/lib/getServerSideProps/getUser";
import { GetManga, getManga } from "@/lib/getServerSideProps/getManga";
import { GetUserRating, getUserRating } from "@/lib/getServerSideProps/getUserRating";
const DynamicMangasBoxesPopular = dynamic(() => import("@/components/global/popularMangas/manga-boxes"))
const DynamicSummary = dynamic(() => import("@/components/mangaHref/summary"))
const DynamicChapters = dynamic(() => import("@/components/mangaHref/chapters"))
const DynamicComments = dynamic(() => import("@/components/mangaHref/comments"))

export const getServerSideProps: GetServerSideProps<{ mangaRes: MangaResponse, popularMangasRes: MangasResponse, userRes: UserResponse, userRatingRes: UserRatingResponse }> = async ({ req, query }) => {
  await dbConnect()
  const { mangaHref } = query
  const { token } = req.cookies
  const [manga, userRating, { user }, popularMangas] = await Promise.all([
    getManga({ href: mangaHref } as GetManga),
    getUserRating({ token, href: mangaHref } as GetUserRating),
    getUser(token),
    getAllPopularMangas(),
  ])
  const popularMangasRes = JSON.parse(JSON.stringify({
    message: "Fetched Popular Mangas",
    data: popularMangas
  }))
  const userRes = JSON.parse(JSON.stringify({
    message: "Fetched User",
    data: user
  }))
  const userRatingRes = JSON.parse(JSON.stringify({
    message: "Fetched User Rating",
    data: userRating
  }))
  const mangaRes = JSON.parse(JSON.stringify({
    message: "Fetched Manga",
    data: manga
  }))
  console.log("🚀 ~ file: [mangaHref].tsx:43 ~ popularMangasRes.message:", popularMangasRes.message)
  console.log("🚀 ~ file: [mangaHref].tsx:48 ~ userRes.message:", userRes.message)
  console.log("🚀 ~ file: [mangaHref].tsx:53 ~ userRatingRes.message:", userRatingRes.message)
  console.log("🚀 ~ file: [mangaHref].tsx:57 ~ mangaRes.message:", mangaRes.message)
  if (!manga) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }
  return {
    props: { mangaRes, userRatingRes, userRes, popularMangasRes }
  }
}

const Page = ({ mangaRes, popularMangasRes, userRes, userRatingRes }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const dispatch = useDispatch()
  const [chaptersOrder, setChaptersOrder] = useState<"latest" | "earliest">("latest")
  const [chapters, setChapters] = useState<MangaType["chapters"]>()
  const mangaState = useSelector((state: RootState) => selectMangaState(state, mangaRes.data!._id))
  const userState = useSelector(selectUserState)
  const [description, setDescription] = useState<string>("")
  const commentsRef = useRef<HTMLDivElement>(null)
  // Add Manga
  useEffect(() => {
    dispatch(addOrUpdateManga(mangaRes.data!))
  }, [dispatch, mangaRes])
  // Set User Rating
  useEffect(() => {
    if (userRatingRes.data) {
      dispatch(setUserRating(userRatingRes.data))
    }
  }, [userRatingRes, dispatch])
  // Set User
  useEffect(() => {
    if (userRes.data) {
      dispatch(setUser(userRes.data))
    }
  }, [dispatch, userRes])
  // Set Chapters
  useEffect(() => {
    setChapters(mangaRes.data?.chapters)
    console.log("🚀 ~ file: [mangaHref].tsx:72 ~ useEffect ~ manga.data?.chapters:", mangaRes.data?.chapters)
  }, [mangaRes])
  // Sort Chapters
  useEffect(() => {
    if (chaptersOrder === "latest" && chapters) {
      const sortedChapters = [...chapters].sort((a, b) => Number(b.num) - Number(a.num))
      setChapters(sortedChapters as any)
    } else if (chaptersOrder === "earliest" && chapters) {
      const sortedChapters = [...chapters].sort((a, b) => Number(a.num) - Number(b.num))
      setChapters(sortedChapters as any)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chaptersOrder])
  // scroll to comments
  const handleScroll = () => {
    if (commentsRef.current) {
      commentsRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }
  // Title For Page
  const title = `Đọc ${mangaState?.name} - Manga Clash`

  const handleChangeChaptersOrder = () => {
    setChaptersOrder(prevChaptersOrder => prevChaptersOrder === "earliest" ? "latest" : "earliest")
  }
  if (mangaState) {
    return (
      <>
        <Head>
          <title>{title}</title>
        </Head>
        {/* user menu */}
        <UserMenu user={userState} />
        <main>
          <MenuFootBox>
            <Navigation manga={mangaState} />
            {/* manga's name */}
            <Name mangaState={mangaState} />
            {/* image and detail manga */}
            <ImageAndDetailManga
              mangaState={mangaState}
              chapters={chapters}
              description={description}
              setDescription={setDescription}
              handleScroll={handleScroll}
            />
          </MenuFootBox>
          <BodyBox>
            <div className="basis-9/12">
              {/* summary */}
              <DynamicSummary
                mangaState={mangaState}
                description={description}
                setDescription={setDescription}
              />
              {/* chapters */}
              <DynamicChapters
                mangaState={mangaState as any}
                chaptersOrder={chaptersOrder}
                chapters={chapters as any}
                handleChangeChaptersOrder={handleChangeChaptersOrder}
                setChapters={setChapters}
              />
              {/* comments */}
              <DynamicComments mangaState={mangaState} ref={commentsRef} />
            </div>
            {/* popular mangas */}
            <DynamicMangasBoxesPopular mangas={popularMangasRes.data} />
          </BodyBox>
        </main>
      </>
    )
  }
}

export default Page;