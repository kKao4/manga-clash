import { useRouter } from "next/router"
import BodyBox from "@/components/global/body-box"
import Navigation from "@/components/global/navigation"
import Image from "next/image"
import Menu from "@/components/chapterNum/menu"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { InferGetServerSidePropsType, GetServerSideProps } from "next"
import { ChapterResponse, ChaptersResponse, UserResponse } from "@/type"
import UserMenu from "@/components/global/user-menu"
import { useSelector, useDispatch } from "react-redux"
import Title from "@/components/global/title"
import { selectUserState, setUser } from "@/features/UserSlice"
import { selectAdminMode, toggleDarkMode } from "@/features/GlobalSlice"
import Head from "next/head"
import dynamic from "next/dynamic"
import NavChapter from "@/components/chapterNum/nav-chapter"
import useMouse from '@react-hook/mouse-position'
import { GetChapter, getChapter } from "@/lib/getServerSideProps/getChapter"
import dbConnect from "@/lib/dbConnect"
import { GetAllChapters, getAllChapters } from "@/lib/getServerSideProps/getAllChapters"
import { getUser } from "@/lib/getServerSideProps/getUser"
import { useEventListener } from 'usehooks-ts'
const DynamicAdminDeleteChapter = dynamic(() => import("@/components/chapterNum/admin-delete-chapter"), {
  ssr: false,
})
const DynamicComments = dynamic(() => import("@/components/chapterNum/comments"))

export const getServerSideProps: GetServerSideProps<{ chapterRes: ChapterResponse, chaptersRes: ChaptersResponse, userRes: UserResponse }> = async ({ req, query }) => {
  await dbConnect()
  const { mangaHref, chapterNum } = query
  const { _id } = req.headers
  const [chapter, chapters, user] = await Promise.all([
    getChapter({ href: mangaHref, chapterNum, _id } as GetChapter),
    getAllChapters({ href: mangaHref } as GetAllChapters),
    getUser(_id as string)
  ])
  const chapterRes = JSON.parse(JSON.stringify({
    message: "Fetched Chapter",
    data: chapter
  }))
  const chaptersRes = JSON.parse(JSON.stringify({
    message: "Fetched All Chapters",
    data: chapters
  }))
  const userRes = JSON.parse(JSON.stringify({
    message: "Fetched User",
    data: user
  }))
  if (!chapter) {
    return {
      notFound: true
    }
  }
  return {
    props: { chapterRes, chaptersRes, userRes }
  }
}

const Page = ({ chapterRes, chaptersRes, userRes }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
  const divRef = useRef<HTMLDivElement>(null)
  const mouse = useMouse(imagesBoxRef, { fps: 60 });
  const [directionArrow, setDirectionArrow] = useState<"right" | "left">()
  // Set User
  useEffect(() => {
    if (userRes.data) {
      dispatch(setUser(userRes.data))
    }
  }, [dispatch, userRes])
  // Set Bookmark
  useEffect(() => {
    if (chapterRes.data && userState) {
      setBookmark(userState.bookmarks.includes(chapterRes.data._id as any))
    }
  }, [chapterRes, userState])
  // Set/Update localStorage For This Manga
  useEffect(() => {
    const array = localStorage.getItem(`${chapterRes.data?.href}`)
    if (array && chapterRes.data) {
      let newArray: string[] = JSON.parse(array)
      if (!newArray.includes(chapterRes.data.chapter.num.toString())) {
        newArray.push(chapterRes.data.chapter.num.toString())
        localStorage.setItem(`${chapterRes.data?.href}`, JSON.stringify(newArray))
      }
    } else {
      localStorage.setItem(`${chapterRes.data?.href}`, JSON.stringify([chapterRes.data?.chapter.num.toString()]))
    }
  }, [chapterRes])
  // set prev/next chapter
  useEffect(() => {
    const index = chaptersRes.data!.chapters.findIndex(obj => obj.num === chapterRes.data!.chapter.num)
    // console.log("🚀 ~ file: [chapterNum].tsx:80 ~ useEffect ~ index:", index)
    if (index === 0) {
      setPrevChapter(chaptersRes.data!.chapters[index + 1] ? chaptersRes.data!.chapters[index + 1].num : chaptersRes.data!.chapters[0].num)
      setNextChapter(chaptersRes.data!.chapters[chaptersRes.data!.chapters.length - 1].num)
    } else if (index === chaptersRes.data!.chapters.length - 1) {
      setPrevChapter(chaptersRes.data!.chapters[0].num)
      setNextChapter(chaptersRes.data!.chapters[index - 1].num)
    } else {
      setPrevChapter(chaptersRes.data!.chapters[index + 1].num)
      setNextChapter(chaptersRes.data!.chapters[index - 1].num)
    }
  }, [chapterRes, chaptersRes])
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
    } else if (readingStyle === "full") {
      setDirectionArrow(undefined)
    }
  }, [mouse, imagesBoxRef, readingStyle])
  // scroll to top when change chapter
  useEffect(() => {
    if (divRef.current && router.query) {
      divRef.current.scrollIntoView()
    }
  }, [router.query])
  // set localStorage for reading style 
  useEffect(() => {
    // console.log("🚀 ~ file: [chapterNum].tsx:143 ~ useEffect ~ localStorage:", localStorage.getItem("readingStyle"))
    if (localStorage.getItem("readingStyle")) {
      setReadingStyle(localStorage.getItem("readingStyle") as any)
    } else {
      setReadingStyle("full")
    }
  }, [])
  const nextPage = useCallback(() => {
    if (index === chapterRes.data!.chapter.imagesPath.length - 1) {
      router.push(`/manga/${chapterRes.data?.href}/chapter-${nextChapter}`)
    } else {
      setIndex(prevState => prevState + 1)
    }
  }, [chapterRes, index, nextChapter, router])
  const prevPage = useCallback(() => {
    if (index === 0) {
      router.push(`/manga/${chapterRes.data?.href}/chapter-${prevChapter}`)
    } else {
      setIndex(prevState => prevState - 1)
    }
  }, [chapterRes, index, prevChapter, router])
  // add keyboard next/prev page
  useEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      nextPage()
      if (divRef.current) {
        divRef.current?.scrollIntoView()
      }
    } else if (e.key === "ArrowLeft") {
      prevPage()
      if (divRef.current) {
        divRef.current?.scrollIntoView()
      }
    }
  })
  // title for page
  const title = useMemo(() => {
    return `Chapter ${(router.query.chapterNum as string).split("-")[1]} - ${chaptersRes.data?.name}`
  }, [router.query.chapterNum, chaptersRes.data?.name])
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <UserMenu user={userState} />
      <NavChapter
        showNavChapter={showNavChapter}
        chapter={chapterRes.data}
        chapters={chaptersRes.data}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
      />
      <div className="dark:bg-neutral-800">
        <BodyBox>
          <div className="basis-full">
            {/* title  */}
            <p className="text-2xl sm:text-3xl font-bold dark:text-white">{chapterRes.data?.name} - Chapter {chapterRes.data?.chapter.num}</p>
            {/* navigation */}
            <div className="w-full grow">
              <Navigation manga={chapterRes.data} />
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
                <DynamicAdminDeleteChapter chapter={chapterRes} prevChapter={prevChapter} />
              )}
            </div>
            <div ref={divRef}>
              <Menu
                chapters={chaptersRes.data}
                prevChapter={prevChapter}
                nextChapter={nextChapter}
                readingStyle={readingStyle}
                setReadingStyle={setReadingStyle}
                index={index}
                setIndex={setIndex}
                chapter={chapterRes.data}
              />
            </div>
            {/* images chapter */}
            <div
              ref={imagesBoxRef as any}
              className={directionArrow === "right" ? "cursor-arrow-right" : directionArrow === "left" ? "cursor-arrow-left" : ""}
              onClick={() => {
                if (directionArrow === "right") {
                  nextPage()
                } else if (directionArrow === "left") {
                  prevPage()
                }
                if (directionArrow) {
                  // scroll to top when change page
                  if (divRef.current) {
                    divRef.current?.scrollIntoView()
                  }
                }
              }}
            >
              {readingStyle === "full" ? (
                <div className="max-w-[960px] mx-auto my-3 lg:my-6 xl:my-8 flex flex-col relative">
                  {chapterRes.data?.chapter.imagesPath.map((c, i) => {
                    return <Image key={c.publicId} className={`block mx-auto object-contain`} src={c.url} alt="" width={960} height={1360} quality={100} priority={i < 2} />
                  })}
                </div>
              ) : (
                <div className="max-w-[960px] aspect-[960/1360] mx-auto my-3 lg:my-6 xl:my-8 relative">
                  {chapterRes.data?.chapter.imagesPath.map((c, i) => {
                    return <Image key={c.publicId} className={`absolute ${index === i ? "opacity-100" : "opacity-0"} object-contain object-center md:object-top`} src={c.url} alt="" fill={true} quality={100} priority={i < 2} />
                  })}
                </div>
              )}
            </div>
            <Menu
              chapters={chaptersRes.data}
              prevChapter={prevChapter}
              nextChapter={nextChapter}
              readingStyle={readingStyle}
              setReadingStyle={setReadingStyle}
              index={index}
              setIndex={setIndex}
              chapter={chapterRes.data}
            />
            {/* comments */}
            <div className="mt-6 sm:mt-12">
              <Title content={`BÌNH LUẬN CHO "Chapter ${chapterRes.data?.chapter.num}"`} order={false} />
            </div>
            <DynamicComments chapter={chapterRes} />
          </div>
        </BodyBox>
      </div>
    </>
  )
}

export default Page