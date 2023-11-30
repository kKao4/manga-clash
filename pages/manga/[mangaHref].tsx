import { MangaResponse, MangasResponse, UserRatingResponse, UserResponse } from "@/type";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import Navigation from "@/components/global/navigation/navigation";
import MenuFootBox from "@/components/global/box/MenuFootBox";
import BodyBox from "@/components/global/box/BodyBox";
import { useMemo, useRef, useState } from "react"
import UserMenu from "@/components/global/userMenu/UserMenu";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { MangaType } from "@/models/manga";
import { setUser, selectUserState } from "@/features/UserSlice";
import { selectMangaState, addOrUpdateManga } from "@/features/mangaHref/MangaSlice";
import { setUserRating } from "@/features/mangaHref/UserRatingSlice";
import ImageAndDetailManga from "@/components/mangaHref/image-and-detail-manga";
import Name from "@/components/mangaHref/Name";
import { RootState } from "@/store";
import dynamic from "next/dynamic";
import dbConnect from "@/lib/dbConnect";
import { getAllPopularMangas } from "@/lib/getServerSideProps/getAllPopularMangas";
import { getUser } from "@/lib/getServerSideProps/getUser";
import { GetManga, getManga } from "@/lib/getServerSideProps/getManga";
import { GetUserRating, getUserRating } from "@/lib/getServerSideProps/getUserRating";
import Script from "next/script";
import { selectAdminMode } from "@/features/GlobalSlice";
import Comments from "@/components/mangaHref/Comments"
import Summary from "@/components/mangaHref/Summary"
import Chapters from "@/components/mangaHref/Chapters"
import { useDarkMode } from "usehooks-ts";
const DynamicMangasBoxesPopular = dynamic(() => import("@/components/global/popularMangas/manga-boxes"))

export const getServerSideProps: GetServerSideProps<{ mangaRes: MangaResponse, popularMangasRes: MangasResponse, userRes: UserResponse, userRatingRes: UserRatingResponse }> = async ({ req, query }) => {
  await dbConnect()
  const { mangaHref } = query
  const { _id } = req.headers
  const [manga, userRating, user, popularMangas] = await Promise.all([
    getManga({ href: mangaHref } as GetManga),
    getUserRating({ _id, href: mangaHref } as GetUserRating),
    getUser(_id as string),
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
      notFound: true
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
  const adminMode = useSelector(selectAdminMode)
  const { isDarkMode } = useDarkMode()
  // Add Manga
  useEffect(() => {
    dispatch(addOrUpdateManga(mangaRes.data!))
  }, [dispatch, mangaRes])
  // Set User Rating
  useEffect(() => {
    if (userRatingRes.data) {
      dispatch(setUserRating({ href: mangaRes.data!.href, star: userRatingRes.data }))
    }
  }, [userRatingRes, dispatch, mangaRes])
  // Set User
  useEffect(() => {
    if (userRes.data) {
      dispatch(setUser(userRes.data))
    }
  }, [dispatch, userRes])
  // Set Chapters
  useEffect(() => {
    setChapters(mangaRes.data?.chapters)
    // console.log("🚀 ~ file: [mangaHref].tsx:72 ~ useEffect ~ manga.data?.chapters:", mangaRes.data?.chapters)
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
  const title = useMemo(() => {
    return `Đọc ${mangaState?.name} - Manga Clash`
  }, [mangaState?.name])

  const handleChangeChaptersOrder = () => {
    setChaptersOrder(prevChaptersOrder => prevChaptersOrder === "earliest" ? "latest" : "earliest")
  }
  if (mangaState) {
    return (
      <>
        {adminMode && (
          <Script
            src="https://upload-widget.cloudinary.com/global/all.js"
            type="text/javascript"
            strategy="lazyOnload"
          />
        )}
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
              <Summary
                mangaState={mangaState}
                description={description}
                setDescription={setDescription}
              />
              {/* chapters */}
              <Chapters
                mangaState={mangaState as any}
                chaptersOrder={chaptersOrder}
                chapters={chapters as any}
                handleChangeChaptersOrder={handleChangeChaptersOrder}
                setChapters={setChapters}
              />
              {/* comments */}
              <Comments key={isDarkMode as any} mangaState={mangaState} ref={commentsRef} />
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