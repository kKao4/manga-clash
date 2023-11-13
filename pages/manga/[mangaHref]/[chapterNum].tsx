import { useRouter } from "next/router"
import BodyBox from "@/components/global/body-box"
import Navigation from "@/components/global/navigation"
import Image from "next/image"
import Menu from "@/components/chapterNum/menu"
import { useState, useEffect, useRef } from "react"
import { InferGetServerSidePropsType, GetServerSideProps } from "next"
import { ChapterResponse, ChaptersResponse, UserResponse } from "@/type"
import UserMenu from "@/components/global/user-menu"
import { useSelector, useDispatch } from "react-redux"
import { DiscussionEmbed } from 'disqus-react';
import Title from "@/components/global/title"
import { selectUserState, setUser } from "@/features/UserSlice"
import { selectAdminMode, selectDarkMode, toggleDarkMode } from "@/features/GlobalSlice"
import Head from "next/head"
import dynamic from "next/dynamic"
import NavChapter from "@/components/chapterNum/nav-chapter"
import useMouse from '@react-hook/mouse-position'
const DynamicDeleteChapter = dynamic(() => import("@/components/chapterNum/admin-delete-chapter"), {
  ssr: false,
  loading: () => <p className="dark:text-white">Loading...</p>
})

export const getServerSideProps: GetServerSideProps<{ chapter: ChapterResponse, chapters: ChaptersResponse, user: UserResponse }> = (async (context) => {
  const { mangaHref, chapterNum } = context.query
  const [chapterRes, chaptersRes, userRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/manga/${mangaHref}/${chapterNum}?token=${context.req.cookies.token}`),
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/manga/${mangaHref}/all_chapters`),
    fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/user/account?token=${context.req.cookies.token}`)
  ]);
  const [chapter, chapters, user] = await Promise.all([chapterRes.json(), chaptersRes.json(), userRes.json()])
  console.log("🚀 ~ file: [chapterNum].tsx:18 ~ user.message:", user.message)
  console.log("🚀 ~ file: [chapterNum].tsx:18 ~ chapters.message:", chapters.message)
  console.log("🚀 ~ file: [chapterNum].tsx:34 ~ getServerSideProps ~ res:", chapter.message)
  if (!chapters.data || !chapter.data) {
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
  const adminMode = useSelector(selectAdminMode)
  const [prevChapter, setPrevChapter] = useState<string>("1")
  const [nextChapter, setNextChapter] = useState<string>("1")
  const [showNavChapter, setShowNavChapter] = useState<boolean>(false)
  const [readingStyle, setReadingStyle] = useState<"full" | "single">("full")
  const [index, setIndex] = useState<number>(0)
  const imagesBoxRef = useRef<HTMLDivElement>(null)
  const mouse = useMouse(imagesBoxRef, { fps: 60 });
  const [directionArrow, setDirectionArrow] = useState<"right" | "left">()
  // Set User
  useEffect(() => {
    if (user.data) {
      dispatch(setUser(user.data))
    }
  }, [dispatch, user])
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
    const index = chapters.data!.chapters.findIndex(obj => obj.num === chapter.data!.chapter.num)
    // console.log("🚀 ~ file: [chapterNum].tsx:80 ~ useEffect ~ index:", index)
    if (index === 0) {
      setPrevChapter(chapters.data!.chapters[index + 1] ? chapters.data!.chapters[index + 1].num : chapters.data!.chapters[0].num)
      setNextChapter(chapters.data!.chapters[chapters.data!.chapters.length - 1].num)
    } else if (index === chapters.data!.chapters.length - 1) {
      setPrevChapter(chapters.data!.chapters[0].num)
      setNextChapter(chapters.data!.chapters[index - 1].num)
    } else {
      setPrevChapter(chapters.data!.chapters[index + 1].num)
      setNextChapter(chapters.data!.chapters[index - 1].num)
    }
  }, [chapter, chapters])
  // detect direction scroll
  useEffect(() => {
    let lastScrollTop = window.scrollY || document.documentElement.scrollTop;
    function detectDirection() {
      const scrollTopPosition =
        window.scrollY || document.documentElement.scrollTop;
      if (scrollTopPosition < lastScrollTop) {
        setShowNavChapter(true)
      } else if (scrollTopPosition > lastScrollTop) {
        setShowNavChapter(false)
      }
      lastScrollTop = scrollTopPosition <= 0 ? 0 : scrollTopPosition;
    }
    window.addEventListener("scroll", detectDirection);
    return () => window.removeEventListener("scroll", detectDirection)
  }, [])
  // reset index when router change
  useEffect(() => {
    setIndex(0)
  }, [router.query])
  // set arrow
  useEffect(() => {
    if (readingStyle === "single" && imagesBoxRef.current && mouse.x && mouse.y) {
      if (mouse.x >= imagesBoxRef.current.clientWidth / 2 && mouse.y > 0) {
        setDirectionArrow("right")
      } else if (mouse.x < imagesBoxRef.current.clientWidth / 2 && mouse.y > 0) {
        setDirectionArrow("left")
      } else {
        setDirectionArrow(undefined)
      }
    }
  }, [mouse, imagesBoxRef, readingStyle])
  // scroll to top when change chapter
  useEffect(() => {
    if (imagesBoxRef.current && router.query) {
      window.scrollTo(0, imagesBoxRef.current.getBoundingClientRect().top + window.scrollY - 100)
    }
  }, [router.query])
  const title = `Chapter ${(router.query.chapterNum as string).split("-")[1]} - ${chapters.data?.name}`
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <UserMenu user={userState} />
      <NavChapter
        showNavChapter={showNavChapter}
        chapter={chapter.data}
        chapters={chapters.data}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
      />
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
              {adminMode && (
                <DynamicDeleteChapter chapter={chapter} prevChapter={prevChapter} />
              )}
            </div>
            <Menu
              chapters={chapters.data}
              prevChapter={prevChapter}
              nextChapter={nextChapter}
              readingStyle={readingStyle}
              setReadingStyle={setReadingStyle}
              index={index}
              setIndex={setIndex}
              chapter={chapter.data}
            />
            {/* images chapter */}
            <div
              ref={imagesBoxRef as any}
              className={directionArrow === "right" ? "cursor-arrow-right" : directionArrow === "left" ? "cursor-arrow-left" : ""}
              onClick={() => {
                if (directionArrow === "right") {
                  if (index === chapter.data!.chapter.imagesPath.length - 1) {
                    router.push(`/manga/${chapter.data?.href}/chapter-${nextChapter}`)
                  } else {
                    setIndex(prevState => prevState + 1)
                  }
                } else if (directionArrow === "left") {
                  if (index === 0) {
                    router.push(`/manga/${chapter.data?.href}/chapter-${prevChapter}`)
                  } else {
                    setIndex(prevState => prevState - 1)
                  }
                }
                // scroll to top when change page
                if (imagesBoxRef.current) {
                  window.scrollTo(0, imagesBoxRef.current.getBoundingClientRect().top + window.scrollY - 100)
                }
              }}
            >
              {readingStyle === "full" ? (
                <div className="w-[960px] mx-auto my-4 sm:my-8 xl:my-12 flex flex-col relative">
                  {chapter.data?.chapter.imagesPath.map((c, i) => {
                    return <Image key={c.publicId} className={`block max-h-[1360px] mx-auto object-contain`} src={c.url} alt="" width={960} height={1360} quality={100} priority={i <= 2} />
                  })}
                </div>
              ) : (
                <div className="w-[960px] h-[1360px] mx-auto my-4 sm:my-8 xl:my-12 relative">
                  {chapter.data?.chapter.imagesPath.map((c, i) => {
                    return <Image key={c.publicId} className={`absolute transition-opacity duration-400 ease-out ${index === i ? "opacity-100" : "opacity-0"} object-contain object-top`} src={c.url} alt="" fill={true} quality={100} priority={i <= 2} />
                  })}
                </div>
              )}
            </div>
            <Menu
              chapters={chapters.data}
              prevChapter={prevChapter}
              nextChapter={nextChapter}
              readingStyle={readingStyle}
              setReadingStyle={setReadingStyle}
              index={index}
              setIndex={setIndex}
              chapter={chapter.data}
            />
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