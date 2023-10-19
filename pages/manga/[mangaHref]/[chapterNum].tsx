import { useRouter } from "next/router"
import BodyBox from "@/components/global/body-box"
import Navigation from "@/components/global/navigation"
import Image from "next/image"
import Menu from "@/components/chapterNum/menu"
import { useState, useEffect } from "react"
import { InferGetServerSidePropsType, GetServerSideProps } from "next"
import { ChapterResponse, ChaptersResponse, HOST_URL, UserResponse } from "@/type"
import UserMenu from "@/components/global/user-menu"
import { useSelector, useDispatch } from "react-redux"
import { DiscussionEmbed } from 'disqus-react';
import Title from "@/components/global/title"
import { selectUserState, setUser } from "@/features/UserSlice"
import { toggleDarkMode } from "@/features/GlobalSlice"

export const getServerSideProps: GetServerSideProps<{ chapter: ChapterResponse, chapters: ChaptersResponse, user: UserResponse }> = (async (context) => {
  const { mangaHref, chapterNum } = context.query
  const [chapterRes, chaptersRes, userRes] = await Promise.all([
    fetch(`${HOST_URL}/api/manga/${mangaHref}/${chapterNum}`),
    fetch(`${HOST_URL}/api/manga/${mangaHref}/all_chapters`),
    fetch(`${HOST_URL}/api/user/account?token=${context.req.cookies.token}`)
  ]);
  const [chapter, chapters, user] = await Promise.all([chapterRes.json(), chaptersRes.json(), userRes.json()])
  console.log("🚀 ~ file: [chapterNum].tsx:18 ~ user.message:", user.message)
  console.log("🚀 ~ file: [chapterNum].tsx:18 ~ chapters.message:", chapters.message)
  console.log("🚀 ~ file: [chapterNum].tsx:34 ~ getServerSideProps ~ res:", chapter.data)
  //FIXME - chapter.data.chapter is undefined
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
  // Set User
  const userState = useSelector(selectUserState)
  useEffect(() => {
    if (user.data) {
      dispatch(setUser(user.data))
    }
  }, [dispatch, user])
  // Set Theme Based On Window Theme
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      dispatch(toggleDarkMode(true))
    }
  }, [dispatch])
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
  // console.log("🚀 ~ file: [chapterNum].tsx:101 ~ onClick={ ~ router.asPath:", router.asPath)
  return (
    <>
      <UserMenu user={userState} />
      <div className="dark:bg-neutral-800">
        <BodyBox>
          <div className="basis-full">
            {/* title  */}
            <p className="mb-4 text-3xl font-bold dark:text-white">{chapter.data?.name} - Chapter {chapter.data?.chapter.num}</p>
            <div className="flex flex-col items-center sm:flex-row">
              {/* navigation */}
              <div className="w-full grow">
                <Navigation manga={chapter.data} />
              </div>
              {/* bookmark/theme button */}
              <div className="mb-2 mr-auto space-x-2 shrink-0">
                <button
                  className="w-8 h-8 transition-colors bg-gray-100 rounded-full group hover:bg-second-green"
                  title="Bookmark this manga"
                  onClick={async () => {
                    const result = await fetch(`${HOST_URL}/api/user/actions/bookmark/${router.query.mangaHref}`)
                    const res = await result.json();
                    setBookmark(b => !b)
                    console.log("🚀 ~ file: [chapterNum].tsx:49 ~ onClick={ ~ res:", res)
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
              </div>
            </div>
            <Menu chapters={chapters.data} />
            {/* images chapter */}
            <div className="max-w-[960px] mx-auto py-4 sm:py-8 xl:py-12 flex flex-col">
              {chapter.data?.chapter.imagesPath.map((c) => {
                return <Image key={c} className="block w-full h-auto mx-auto" sizes="100vw" src={`/${c}`} alt="" width={960} height={1360} quality={100} />
              })}
            </div>
            <Menu chapters={chapters.data} />
            <div className="mt-12">
              <Title content={`BÌNH LUẬN CHO "Chapter ${chapter.data?.chapter.num}"`} order={false} />
            </div>
            <article className="mt-8 disqus">
              <DiscussionEmbed
                shortname="manga-clash-disqus-com"
                config={
                  {
                    url: HOST_URL + router.asPath,
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