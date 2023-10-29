import { MangaResponse, StarType, UserRatingResponse, UserResponse } from "@/type"
import TagsDetailManga from "./tags-detail-manga";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux";
import { toggleSignIn } from "@/features/GlobalSlice";
import Star from "./star";
import { CommentCount } from "disqus-react";
import { shortName } from "@/type";
import { MangaType } from "@/models/manga";
import Link from "next/link";
import { addOrUpdateManga } from "@/features/mangaHref/MangaSlice";
import { selectUserRating, setUserRating } from "@/features/mangaHref/UserRatingSlice";
import { PulseLoader } from "react-spinners";
import { selectUserState } from "@/features/UserSlice";
import numeral from "numeral"

export default function DetailManga({ manga, chapters, handleScroll }: { manga: MangaType, chapters: MangaType["chapters"] | undefined, handleScroll: () => void }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const myRef = useRef<HTMLDivElement>(null)
  const userState = useSelector(selectUserState)
  const userRatingState = useSelector(selectUserRating)
  const [bookmark, setBookmark] = useState<boolean>(false)
  const [yourRating, setYourRating] = useState<StarType>(1)
  const [isLoadingUserRating, setIsLoadingUserRating] = useState<boolean>(false)
  const [isLoadingBookmark, setIsLoadingBookmark] = useState<boolean>(false)
  // Animation when finishing refetch user rating api
  useEffect(() => {
    if (!isLoadingUserRating) {
      const timeOut = setTimeout(() => {
        if (myRef.current) {
          myRef.current.style.zIndex = "-10"
        }
      }, 400)
      return () => clearTimeout(timeOut)
    } else {
      if (myRef.current) {
        myRef.current.style.zIndex = "10"
      }
    }
  }, [isLoadingUserRating])
  useEffect(() => {
    if (userState) {
      setBookmark(userState.bookmarks.includes(manga!._id as any))
    } else {
      setBookmark(false)
    }
  }, [manga, userState])
  const handleBookmark = async () => {
    setIsLoadingBookmark(true)
    const result = await fetch(`/api/user/actions/bookmark/${router.query.mangaHref}`);
    const res = await result.json()
    console.log("🚀 ~ file: detail-manga.tsx:23 ~ handleBookmark ~ res:", res)
    if (!res.message) {
      dispatch(toggleSignIn(true))
    } else {
      setBookmark(b => !b)
    }
    setIsLoadingBookmark(false)
  }
  const handleHoverStar = (num: StarType) => {
    setYourRating(num)
  }
  const handleRating = async (num: StarType) => {
    setIsLoadingUserRating(true)
    const result = await fetch(`/api/user/actions/rating/star`, {
      method: "POST",
      body: JSON.stringify({
        star: num,
        href: router.query.mangaHref
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    const res = await result.json()
    console.log("🚀 ~ file: detail-manga.tsx:41 ~ handleRating ~ res:", res)
    if (res.message) {
      const [mangaResult, userRatingResult] = await Promise.all([fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/manga/${router.query.mangaHref}`), fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/user/user_rating?href=${manga.href}`)])
      const [mangaRes, userRatingRes]: [MangaResponse, UserRatingResponse] = await Promise.all([mangaResult.json(), userRatingResult.json()])
      if (mangaRes.data && userRatingRes.data) {
        dispatch(addOrUpdateManga(mangaRes.data))
        dispatch(setUserRating(userRatingRes.data.star))
      }
      // if (res.data) {
      //   router.replace(router.asPath, "", { scroll: false })
      // }
    } else if (res.error) {
      alert(res.error)
      dispatch(toggleSignIn(true))
    }
    setIsLoadingUserRating(false)
  }
  return (
    <>
      {/* manga's rating */}
      <div className="relative flex flex-row flex-wrap items-center mb-4 group/stars max-w-fit">
        <div className="flex flex-row items-center group-hover/stars:opacity-0">
          {/* star != 0 thi tra ve */}
          {manga.rating.star ? (
            <>
              {Array.from(Array(Math.floor(manga.rating.star)).keys()).map(s => {
                return <svg key={s} className={`h-6 fill-main-yellow ${isLoadingUserRating ? "opacity-40" : "opacity-100"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" /></svg>
              })}
              {/* star du = 0 thi khong tra ve gi het  */}
              {Number((manga.rating.star % 1).toFixed(1)) ? (
                <>
                  {Number((manga.rating.star % 1).toFixed(1)) <= 0.2 ? (
                    <svg className={`h-6 fill-main-yellow ${isLoadingUserRating ? "opacity-40" : "opacity-100"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z" /></svg>
                  ) : Number((manga.rating.star % 1).toFixed(1)) < 0.8 ? (
                    <svg className={`h-6 fill-main-yellow ${isLoadingUserRating ? "opacity-40" : "opacity-100"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M341.5 13.5C337.5 5.2 329.1 0 319.9 0s-17.6 5.2-21.6 13.5L229.7 154.8 76.5 177.5c-9 1.3-16.5 7.6-19.3 16.3s-.5 18.1 5.9 24.5L174.2 328.4 148 483.9c-1.5 9 2.2 18.1 9.7 23.5s17.3 6 25.3 1.7l137-73.2 137 73.2c8.1 4.3 17.9 3.7 25.3-1.7s11.2-14.5 9.7-23.5L465.6 328.4 576.8 218.2c6.5-6.4 8.7-15.9 5.9-24.5s-10.3-14.9-19.3-16.3L410.1 154.8 341.5 13.5zM320 384.7V79.1l52.5 108.1c3.5 7.1 10.2 12.1 18.1 13.3l118.3 17.5L423 303c-5.5 5.5-8.1 13.3-6.8 21l20.2 119.6L331.2 387.5c-3.5-1.9-7.4-2.8-11.2-2.8z" /></svg>
                  ) : (
                    <svg className={`h-6 fill-main-yellow ${isLoadingUserRating ? "opacity-40" : "opacity-100"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" /></svg>
                  )}
                </>
              ) : ""}
              {Array.from(Array(Math.floor(5 - manga.rating.star)).keys()).map(s => {
                return <svg key={s} className={`h-6 fill-main-yellow ${isLoadingUserRating ? "opacity-40" : "opacity-100"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" > <path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z" /></svg>
              })}
            </>
          ) : (
            <>
              <svg className={`h-6 fill-main-yellow ${isLoadingUserRating ? "opacity-40" : "opacity-100"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z" /></svg>
              <svg className={`h-6 fill-main-yellow ${isLoadingUserRating ? "opacity-40" : "opacity-100"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z" /></svg>
              <svg className={`h-6 fill-main-yellow ${isLoadingUserRating ? "opacity-40" : "opacity-100"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z" /></svg>
              <svg className={`h-6 fill-main-yellow ${isLoadingUserRating ? "opacity-40" : "opacity-100"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z" /></svg>
              <svg className={`h-6 fill-main-yellow ${isLoadingUserRating ? "opacity-40" : "opacity-100"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z" /></svg>
            </>
          )}
        </div>
        <span className={`block ml-2 text-2xl font-bold group-hover/stars:hidden ${isLoadingUserRating ? "opacity-40" : "opacity-100"}`}>{manga.rating.star ? `${manga.rating.star.toFixed(1)}` : "Chưa Có Đánh Giá"}</span>
        <span className={`hidden ml-2 text-2xl font-bold group-hover/stars:block ${isLoadingUserRating ? "opacity-40" : "opacity-100"}`}>Đánh Giá Truyện</span>
        {userRatingState?.star ? (
          <span
            key={manga!.href}
            className={`font-bold ml-1.5 ${isLoadingUserRating ? "opacity-40" : "opacity-100"}`}>
            (Đánh giá của bạn: {userRatingState.star.toFixed(1)})
          </span>
        ) : ""}
        <div className={`absolute flex flex-row items-center h-full mb-4 opacity-0 cursor-pointer top-1 group-hover/stars:opacity-100`}>
          <Star num={1} rating={yourRating} handleHover={handleHoverStar} handleOnClick={handleRating} />
          <Star num={2} rating={yourRating} handleHover={handleHoverStar} handleOnClick={handleRating} />
          <Star num={3} rating={yourRating} handleHover={handleHoverStar} handleOnClick={handleRating} />
          <Star num={4} rating={yourRating} handleHover={handleHoverStar} handleOnClick={handleRating} />
          <Star num={5} rating={yourRating} handleHover={handleHoverStar} handleOnClick={handleRating} />
        </div>
        <div ref={myRef} className={`absolute top-2 left-10 ${isLoadingUserRating ? "opacity-100" : "opacity-0"} transition-all duration-400`}>
          <PulseLoader size={12} color="#409a88" margin={3} />
        </div>
      </div>
      <div className="flex flex-col xl:flex-wrap gap-y-4 xl:flex-row">
        <div className="flex flex-col basis-2/3 gap-y-2.5 max-h-fit">
          {/* rating information */}
          <div className="flex flex-col sm:flex-row">
            <p className="text-sm font-bold basis-1/5">Đánh giá</p>
            <p className="text-sm basis-4/5">Trung bình {manga.rating.star.toFixed(1)} / 5 của {manga.rating.length >= 1000 ? `${numeral(manga.rating.length).format("0.0a")}` : `${manga.rating.length}`} lượt đánh giá</p>
          </div>
          {/* rank information */}
          <div className="flex flex-col sm:flex-row">
            <p className="text-sm font-bold basis-1/5">Thứ hạng</p>
            <p className="text-sm basis-4/5">{numeral(manga.views.rank).format("0o")} và có tổng {manga.views.value >= 1000 ? `${numeral(manga.views.value).format("0.0a")}` : `${manga.views.value}`} lượt xem</p>
          </div>
          {/* other name information */}
          <div className="flex flex-col sm:flex-row">
            <p className="text-sm font-bold basis-1/5">Tên khác</p>
            <p className="text-sm basis-4/5">{manga.otherName ? `${manga.otherName}` : "Đang cập nhật"}</p>
          </div>
          <div className="flex flex-col sm:flex-row">
            <p className="text-sm font-bold basis-1/5">Tác giả</p>
            <p
              className={`text-sm basis-4/5 ${manga.author ? "text-second-green font-semibold cursor-pointer" : ""}`}
              onClick={() => router.push(`/search?author=${manga.author}`)}
            >
              {manga.author ? `${manga.author}` : "Đang cập nhật"}
            </p>
          </div>
          {/* status information */}
          <div className="flex flex-col sm:flex-row">
            <p className="text-sm font-bold basis-1/5">Trạng thái</p>
            <p className="text-sm basis-4/5">{manga.completed ? "Hoàn thành" : "Đang tiến hành"}</p>
          </div>
          {/* genres information */}
          <div className="flex flex-col sm:flex-row">
            <p className="text-sm font-bold basis-1/5">Thể Loại</p>
            {manga.tags.length ? (
              <p className="text-sm basis-4/5">
                <TagsDetailManga manga={manga} />
              </p>
            ) : <p className="text-sm">Đang cập nhật</p>}
          </div>
        </div>
        <div className="basis-1/3">
          <div className="flex flex-row">
            {/* comments information */}
            <div className="flex flex-col basis-1/2 gap-y-3">
              <button type="button" className="w-full" onClick={handleScroll}>
                <svg className="block h-8 mx-auto cursor-pointer fill-second-green" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5 .4-.9 .7-1.1 .8l-.2 .2 0 0 0 0C1 327.2-1.4 334.4 .8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.3-11.4C134.1 343.3 169.8 352 208 352zM448 176c0 112.3-99.1 196.9-216.5 207C255.8 457.4 336.4 512 432 512c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9l0 0 0 0-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-7-10.7-15.4-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1 .6 10.3 .6 15.5z" /></svg>
              </button>
              <div className="text-sm text-center select-none">
                <CommentCount shortname={shortName} config={
                  {
                    url: process.env.NEXT_PUBLIC_HOST_URL + router.asPath,
                    identifier: manga!.href,
                    title: manga!.name,
                  }
                } />
              </div>
            </div>
            {/* bookmarks information */}
            <div className="flex flex-col basis-1/2 gap-y-3">
              <div className="w-full">
                {bookmark ? (
                  <svg className={`${isLoadingBookmark ? "opacity-50" : "opacity-100"} block h-8 px-2 mx-auto cursor-pointer fill-second-green`} onClick={handleBookmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg>
                ) : (
                  <svg className={`${isLoadingBookmark ? "opacity-50" : "opacity-100"} block h-8 px-2 mx-auto cursor-pointer fill-second-green`} onClick={handleBookmark} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z" /></svg>
                )}
              </div>
              {bookmark ? (
                <p className="text-sm text-center select-none">Bạn đã thích truyện</p>
              ) : (
                <p className="text-sm text-center select-none">{manga.bookmarks} người theo dõi truyện</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center xl:justify-start gap-x-2.5">
          <Link
            href={chapters && chapters.length ? `/manga/${manga.href}/chapter-${chapters[chapters.length - 1].num}` : "/"}
            className="text-white bg-second-green font-bold px-3 py-2.5 rounded-md text-sm hover:bg-black transition-colors"
          >
            Chapter Đầu
          </Link>
          <Link
            href={chapters && chapters.length ? `/manga/${manga.href}/chapter-${chapters[0].num}` : "/"}
            className="text-white bg-second-green font-bold px-3 py-2.5 rounded-md text-sm hover:bg-black transition-colors"
          >
            Chapter Cuối
          </Link>
        </div>
      </div>
    </>
  )
}