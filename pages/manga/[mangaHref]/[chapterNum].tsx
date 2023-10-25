import { useRouter } from "next/router"
import BodyBox from "@/components/global/body-box"
import Navigation from "@/components/global/navigation"
import Image from "next/image"
import Menu from "@/components/chapterNum/menu"
import { useState, useEffect } from "react"
import { InferGetServerSidePropsType, GetServerSideProps } from "next"
import { ChapterResponse, ChaptersResponse, UserResponse } from "@/type"
import UserMenu from "@/components/global/user-menu"
import { useSelector, useDispatch } from "react-redux"
import { DiscussionEmbed } from 'disqus-react';
import Title from "@/components/global/title"
import { selectUserState, setUser } from "@/features/UserSlice"
import { selectDarkMode, toggleDarkMode } from "@/features/GlobalSlice"
import Head from "next/head"

export const getServerSideProps: GetServerSideProps<{ chapter: ChapterResponse, chapters: ChaptersResponse, user: UserResponse }> = (async (context) => {
  const { mangaHref, chapterNum } = context.query
  const [chapterRes, chaptersRes, userRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/manga/${mangaHref}/${chapterNum}`),
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/manga/${mangaHref}/all_chapters`),
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/user/account?token=${context.req.cookies.token}`)
  ]);
  const [chapter, chapters, user] = await Promise.all([chapterRes.json(), chaptersRes.json(), userRes.json()])
  // console.log("🚀 ~ file: [chapterNum].tsx:18 ~ user.message:", user.message)
  // console.log("🚀 ~ file: [chapterNum].tsx:18 ~ chapters.message:", chapters.message)
  // console.log("🚀 ~ file: [chapterNum].tsx:34 ~ getServerSideProps ~ res:", chapter.message)
  if (!chapters.data || !chapter.data.chapter) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }
  return { props: { chapter, chapters, user } }
})

const Page = ({ chapter, chapters, user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [bookmark, setBookmark] = useState<boolean>(false)
  const userState = useSelector(selectUserState)
  const darkMode = useSelector(selectDarkMode)
  const [prevChapter, setPrevChapter] = useState<string>("1")
  const [nextChapter, setNextChapter] = useState<string>("1")
  // Set User
  useEffect(() => {
    if (user.data) {
      dispatch(setUser(user.data))
    }
  }, [dispatch, user])
  // Set Theme Based On Window Theme
  // useEffect(() => {
  //   if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  //     dispatch(toggleDarkMode(true))
  //   }
  // }, [dispatch])
  // Set Bookmark
  useEffect(() => {
    if (chapter.data && userState) {
      setBookmark(userState.bookmarks.includes(chapter.data._id as any))
    }
  }, [chapter, userState])
  // Set/Update localStorage For This Manga
  useEffect(() => {
    const array = localStorage.getItem(`${chapter.data?.href}`)
    if (array && chapter.data) {
      let newArray: string[] = JSON.parse(array)
      if (!newArray.includes(chapter.data.chapter.num.toString())) {
        newArray.push(chapter.data.chapter.num.toString())
        localStorage.setItem(`${chapter.data?.href}`, JSON.stringify(newArray))
      }
    } else {
      localStorage.setItem(`${chapter.data?.href}`, JSON.stringify([chapter.data?.chapter.num.toString()]))
    }
  }, [chapter])
  // set prev/next chapter
  useEffect(() => {
    const index = chapters.data!.chapters.indexOf(chapter.data!.chapter.num)
    // console.log("🚀 ~ file: [chapterNum].tsx:80 ~ useEffect ~ index:", index)
    setPrevChapter(chapters.data!.chapters[index + 1])
    setNextChapter(chapters.data!.chapters[index - 1])
    if (index === 0) {
      setNextChapter(chapters.data!.chapters[chapters.data!.chapters.length - 1])
    } else if (index === chapters.data!.chapters.length - 1) {
      setPrevChapter(chapters.data!.chapters[0])
    }
  }, [chapter, chapters])
  // // console.log("🚀 ~ file: [chapterNum].tsx:101 ~ onClick={ ~ router.asPath:", router.asPath)
  const title = `Chapter ${(router.query.chapterNum as string).split("-")[1]} - ${chapters.data?.name}`
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {/* TODO: add admin mode to delete chapter */}
      <UserMenu user={userState} />
      <div className="dark:bg-neutral-800">
        <BodyBox>
          <div className="basis-full">
            {/* title  */}
            <p className="text-3xl font-bold dark:text-white">{chapter.data?.name} - Chapter {chapter.data?.chapter.num}</p>
            {/* navigation */}
            <div className="w-full grow">
              <Navigation manga={chapter.data} />
            </div>
            <div className="flex flex-row items-center">
              {/* bookmark/theme button */}
              <div className="mb-3 mr-auto space-x-2 shrink-0">
                <button
                  className="w-8 h-8 transition-colors bg-gray-100 rounded-full group hover:bg-second-green"
                  title="Bookmark this manga"
                  onClick={async () => {
                    const result = await fetch(`/api/user/actions/bookmark/${router.query.mangaHref}`)
                    const res = await result.json();
                    setBookmark(b => !b)
                    // console.log("🚀 ~ file: [chapterNum].tsx:49 ~ onClick={ ~ res:", res)
                  }}
                >
                  {bookmark ? (
                    <svg className="block h-4 mx-auto transition-colors fill-second-green group-hover:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg>
                  ) : (
                    <svg className="block h-4 mx-auto transition-colors fill-second-green group-hover:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z" /></svg>
                  )}
                </button>
                <button
                  className="w-8 h-8 transition-colors bg-gray-100 rounded-full group hover:bg-second-green"
                  onClick={() => dispatch(toggleDarkMode())}
                  title="Dark/Light theme"
                >
                  <svg className="block h-4 mx-auto transition-colors fill-second-green group-hover:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M448 256c0-106-86-192-192-192V448c106 0 192-86 192-192zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" /></svg>
                </button>
                {/* admin delete chapter */}
              </div>
              <div className="">
                <button
                  className="px-2 py-1.5 group hover:bg-red-500 rounded transition-colors"
                // onClick={() => setIsOpenDeleteModal((prevState: any) => !prevState)}
                >
                  <svg className="h-4 fill-red-500 group-hover:fill-white transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" /></svg>
                </button>
              </div>
            </div>
            <Menu chapters={chapters.data} prevChapter={prevChapter} nextChapter={nextChapter} />
            {/* images chapter */}
            <div className="max-w-[960px] mx-auto py-4 sm:py-8 xl:py-12 flex flex-col">
              {chapter.data?.chapter.imagesPath.map((c) => {
                return <Image key={c.publicId} className={`block w-full h-auto mx-auto ${darkMode ? "" : "border border-gray-200"}`} sizes="100vw" src={c.url} alt="" width={960} height={1360} quality={100} />
              })}
            </div>
            <Menu chapters={chapters.data} prevChapter={prevChapter} nextChapter={nextChapter} />
            <div className="mt-6 sm:mt-12">
              <Title content={`BÌNH LUẬN CHO "Chapter ${chapter.data?.chapter.num}"`} order={false} />
            </div>
            <article className="mt-8 disqus">
              <DiscussionEmbed
                shortname="manga-clash-disqus-com"
                config={
                  {
                    url: process.env.NEXT_PUBLIC_HOST_URL + router.asPath,
                    identifier: chapter.data?.href + "-chapter-" + chapter.data?.chapter.num,
                    title: chapter.data?.name + " - Chapter " + chapter.data?.chapter.num,
                  }
                }
              />
            </article>
          </div>
        </BodyBox>
      </div>
    </>
  )
}

export default Page