import { MangaResponse, MangasResponse, UserRatingResponse, UserResponse } from "@/type";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import Navigation from "@/components/global/navigation";
import MenuFootBox from "@/components/global/menu-foot-box";
import BodyBox from "@/components/global/body-box";
import Title from "@/components/global/title";
import MangasBoxesPopular from "@/components/global/popularMangas/manga-boxes";
import { useRef, useState } from "react"
import UserMenu from "@/components/global/user-menu";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { DiscussionEmbed } from "disqus-react";
import { useRouter } from "next/router";
import { MangaType } from "@/models/manga";
import { setUser, selectUserState } from "@/features/UserSlice";
import { selectMangaState, addOrUpdateManga } from "@/features/mangaHref/MangaSlice";
import { setUserRating } from "@/features/mangaHref/UserRatingSlice";
import ImageAndDetailManga from "@/components/mangaHref/image-and-detail-manga";
import Summary from "@/components/mangaHref/summary";
import Chapters from "@/components/mangaHref/chapters";
import Name from "@/components/mangaHref/name";
import { RootState } from "@/store";

export const getServerSideProps: GetServerSideProps<{ manga: MangaResponse, popularMangas: MangasResponse, user: UserResponse, userRating: UserRatingResponse }> = async (context) => {
  const [mangaRes, popularMangasRes, userRes, userRatingRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/manga/${context.params?.mangaHref}`),
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/popular_mangas`),
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/user/account?token=${context.req.cookies.token}`),
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/user/user_rating?href=${context.params?.mangaHref}&token=${context.req.cookies.token}`)
  ])
  const [manga, popularMangas, user, userRating] = await Promise.all([mangaRes.json(), popularMangasRes.json(), userRes.json(), userRatingRes.json()])
  if (!manga.data) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }
  return { props: { manga, popularMangas, user, userRating } }
}

const Page = ({ manga, popularMangas, user, userRating }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [chaptersOrder, setChaptersOrder] = useState<"latest" | "earliest">("latest")
  const [chapters, setChapters] = useState<MangaType["chapters"]>()
  const mangaState = useSelector((state: RootState) => selectMangaState(state, manga.data!._id))
  const userState = useSelector(selectUserState)
  const [description, setDescription] = useState<string>("")
  const commentsRef = useRef<HTMLDivElement>(null)
  // Add Manga
  useEffect(() => {
    dispatch(addOrUpdateManga(manga.data!))
  }, [dispatch, manga])
  // Set User Rating
  useEffect(() => {
    if (userRating.data) {
      dispatch(setUserRating(userRating.data.star))
    }
  }, [userRating, dispatch])
  // Set User
  useEffect(() => {
    if (user.data) {
      dispatch(setUser(user.data))
    }
  }, [dispatch, user])
  // Set Chapters
  useEffect(() => {
    setChapters(manga.data?.chapters)
  }, [manga])
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
              <div ref={commentsRef} className="mb-4">
                <Title content="BÌNH LUẬN" order={false} />
                <div className="mt-8">
                  <DiscussionEmbed shortname="manga-clash-disqus-com" config={
                    {
                      url: process.env.NEXT_PUBLIC_HOST_URL + router.asPath,
                      identifier: mangaState.href,
                      title: mangaState.name,
                    }
                  } />
                </div>
              </div>
            </div>
            {/* popular mangas */}
            <MangasBoxesPopular mangas={popularMangas.data} />
          </BodyBox>
        </main>
      </>
    )
  }
}

export default Page;