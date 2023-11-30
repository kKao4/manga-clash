import MenuFootBox from "@/components/global/box/MenuFootBox";
import BodyBox from "@/components/global/box/BodyBox";
import OrderNavigation from "@/components/global/order/OrderNavigation";
import MangaBox from "@/components/search/MangaBox";
import Paginate from "@/components/global/paginate/Paginate";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { MangasResponse, UserResponse } from "@/type";
import { useSelector, useDispatch } from "react-redux";
import { selectSearchState, setSearchName, setSearchAuthor, setSearchCompleted, addSearchTags, setPageSearch, resetSearchTags, setSearchTags } from "@/features/search/SearchSlice";
import { useRouter } from "next/router";
import { MyRipples } from "@/components/global/ButtonRipple";
import { useMemo, useRef, useState } from "react";
import UserMenu from "@/components/global/userMenu/UserMenu";
import Head from "next/head";
import { useEffect } from "react";
import { selectUserState, setUser } from "@/features/UserSlice";
import { setSort } from "@/features/GlobalSlice";
import dynamic from "next/dynamic";
import { GetALlMangas, getAllMangas } from "@/lib/getServerSideProps/getAllMangas";
import { getUser } from "@/lib/getServerSideProps/getUser";
import dbConnect from "@/lib/dbConnect";
import MenuFoot from "@/components/search/MenuFoot";
const DynamicAdvanced = dynamic(() => import("@/components/search/Advanced"))

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
      <MenuFoot setSearched={setSearched} />
      <BodyBox>
        <div ref={myRef} className="basis-full">
          <OrderNavigation mangasLength={mangasRes.length} search={true} />
          <div className="w-full py-8">
            <div className="grid grid-cols-2 gap-y-12">
              {mangasRes.data ? (
                <>
                  {mangasRes.data.map(manga => {
                    return <MangaBox key={manga.name + "-search"} manga={manga} />
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