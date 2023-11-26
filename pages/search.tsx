import MenuFootBox from "@/components/global/menu-foot-box";
import BodyBox from "@/components/global/body-box";
import OrderNavigation from "@/components/global/order-navigation";
import MangaBox from "@/components/search/manga-box";
import Paginate from "@/components/global/paginate";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { MangasResponse, UserResponse } from "@/type";
import { useSelector, useDispatch } from "react-redux";
import { selectSearchState, setSearchName, setSearchAuthor, setSearchCompleted, addSearchTags, setPageSearch, resetSearchTags, setSearchTags } from "@/features/search/SearchSlice";
import { useRouter } from "next/router";
import { MyRipples } from "@/components/global/button-ripple";
import { useMemo, useRef, useState } from "react";
import UserMenu from "@/components/global/user-menu";
import Head from "next/head";
import { useEffect } from "react";
import { selectUserState, setUser } from "@/features/UserSlice";
import { setSort } from "@/features/GlobalSlice";
import dynamic from "next/dynamic";
import { GetALlMangas, getAllMangas } from "@/lib/getServerSideProps/getAllMangas";
import { getUser } from "@/lib/getServerSideProps/getUser";
import dbConnect from "@/lib/dbConnect";
const DynamicAdvanced = dynamic(() => import("@/components/search/advanced"))

export const getServerSideProps: GetServerSideProps<{ mangasRes: MangasResponse, userRes: UserResponse }> = async ({ req, query }) => {
  await dbConnect()
  let { page, sort, name, author, completed, tags } = query
  const { _id } = req.headers
  page = page ?? "1"
  sort = sort ?? "latest"
  name = name ?? ""
  author = author ?? ""
  completed = completed ?? ""
  tags = tags ?? ""
  const [{ mangasLength, mangas }, user] = await Promise.all([
    getAllMangas({ page, sort, name, author, completed, tags } as GetALlMangas),
    getUser(_id as string)
  ])
  const mangasRes = JSON.parse(JSON.stringify({
    message: "Fetched Mangas",
    length: mangasLength,
    data: mangas,
  }))
  const userRes = JSON.parse(JSON.stringify({
    message: "Fetched User",
    data: user
  }))
  console.log("🚀 ~ file: search.tsx:33 ~ mangasRes.message:", mangasRes.message)
  console.log("🚀 ~ file: search.tsx:38 ~ userRes.message:", userRes.message)
  return { props: { mangasRes: mangasRes, userRes: userRes } }
}

const Page = ({ mangasRes, userRes }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const searchState = useSelector(selectSearchState)
  const dispatch = useDispatch()
  const router = useRouter()
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)
  const userState = useSelector(selectUserState)
  const [searched, setSearched] = useState<boolean>(false)
  const myRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (searched) {
      myRef.current?.scrollIntoView({ behavior: "smooth" })
      setSearched(false)
    }
  }, [searched])
  useEffect(() => {
    if (userRes.data) {
      dispatch(setUser(userRes.data))
    }
  }, [dispatch, userRes])
  useEffect(() => {
    if (router.query.page) {
      dispatch(setPageSearch(Number(router.query.page)))
    } else {
      dispatch(setPageSearch(1))
    }
  }, [dispatch, router.query.page])
  useEffect(() => {
    if (router.query.sort) {
      dispatch(setSort(router.query.sort as any))
    } else {
      dispatch(setSort("latest"))
    }
  }, [dispatch, router.query.sort])
  useEffect(() => {
    if (router.query.name) {
      dispatch(setSearchName(router.query.name as string))
    } else {
      dispatch(setSearchName(""))
    }
    if (router.query.author) {
      dispatch(setSearchAuthor(router.query.author as string))
    } else {
      dispatch(setSearchAuthor(""))
    }
    if (router.query.completed) {
      dispatch(setSearchCompleted(router.query.completed as "true" | "false" | ""))
    } else {
      dispatch(setSearchCompleted(""))
    }
    // console.log("🚀 ~ file: search.tsx:66 ~ useEffect ~ router.query.tags:", router.query.tags)
    if (router.query.tags && Array.isArray(router.query.tags)) {
      router.query.tags.forEach((tag) => {
        dispatch(addSearchTags(tag))
        // console.log("🚀 ~ file: search.tsx:69 ~ router.query.tags.forEach ~ tag:", tag)
      })
    } else if (router.query.tags && !Array.isArray(router.query.tags)) {
      dispatch(setSearchTags(router.query.tags))
    } else if (!router.query.tags) {
      dispatch(resetSearchTags())
    }
  }, [dispatch, router.query])
  // open advanced has params 
  useEffect(() => {
    if (router.query.author || router.query.year || router.query.completed || router.query.tags) {
      setShowAdvanced(true)
    }
  }, [router])
  const title = useMemo(() => {
    return `Tìm kiếm cho ${searchState.name} - Manga Clash`
  }, [searchState.name])
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <UserMenu user={userState} />
      <MenuFootBox>
        <div className="flex flex-col items-stretch py-4 sm:flex-row gap-x-4 gap-y-4 md:gap-x-10">
          <form className="flex flex-row grow" onSubmit={(e) => {
            e.preventDefault()
            router.push(`/search?page=1&sort=latest&name=${searchState.name}`, "", { scroll: false })
          }}>
            {/* input search box */}
            <input
              className="w-full px-4 py-3 text-lg md:px-6 rounded-l-md focus:outline-none dark:bg-neutral-700"
              type="text"
              value={searchState.name}
              onChange={(e) => dispatch(setSearchName(e.target.value))}
            />
            {/* submit button */}
            <MyRipples className="rounded-r-md min-w-fit">
              <button type="submit" className="relative h-full font-bold text-white transition-colors px-9 max-w-fit bg-second-green hover:bg-black">
                <svg className="absolute h-5 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg>
              </button>
            </MyRipples>
          </form>
          {/* advanced button */}
          <MyRipples className="max-w-fit">
            <button
              className="px-6 py-4 font-bold text-white transition-colors max-w-fit bg-second-green hover:bg-black"
              onClick={() => setShowAdvanced(s => !s)}
            >
              Nâng Cao
              <svg className="inline-block h-3 ml-1 align-baseline fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" /></svg>
            </button>
          </MyRipples>
        </div>
        <div className={`${showAdvanced ? "opacity-100 max-h-[820px] sm:max-h-[600px] md:max-h-[500px]" : "max-h-0 opacity-0"} overflow-hidden transition-all duration-400`}>
          <DynamicAdvanced setSearched={setSearched} />
        </div>
      </MenuFootBox>
      <BodyBox>
        <div ref={myRef} className="basis-full">
          <OrderNavigation mangasLength={mangasRes.length} search={true} />
          <div className="w-full py-8">
            <div className="grid grid-cols-2 gap-y-12">
              {mangasRes.data ? (
                <>
                  {mangasRes.data.map(manga => {
                    return <MangaBox key={manga.href} manga={manga} />
                  })}
                </>
              ) : (
                <p className="col-span-2 text-lg text-center">Không có bộ truyện nào khớp với yêu cầu tìm kiếm, vui lòng thử lại</p>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            {mangasRes.length ? (
              <Paginate mangasLength={mangasRes.length} page="search" />
            ) : ""}
          </div>
        </div>
      </BodyBox>
    </>
  )
}

export default Page;