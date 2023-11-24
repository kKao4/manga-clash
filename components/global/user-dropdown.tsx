import { UserResponse } from "@/type";
import { useRouter } from "next/router";
import { setMenu } from "@/features/user-settings/UserSettingsSlice";
import { useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import blankProfile from "@/assets/blank-profile-picture_640.webp"
import { initialUserState, setUser } from "@/features/UserSlice";

export default function UserDropdown({ user }: { user: UserResponse["data"] }) {
  const router = useRouter()
  const dispatch = useDispatch()
  return (
    <button className="relative flex flex-row items-center text-gray-200 gap-x-2 group">
      <p className="font-normal">Xin chào, {user?.role === "admin" ? "admin" : ""} <span className="font-semibold text-main-green">{user?.username}</span></p>
      {/* profile picture */}
      <div className="w-8 h-8 overflow-hidden border rounded-full relative">
        {user?.profilePicture.url ? (
          <Image src={user.profilePicture.url} alt="profile picture" fill={true} className="object-fill" quality={0} />
        ) : (
          <Image src={blankProfile} alt="" fill={true} className="object-fill" quality={0} />
        )}
      </div>
      <div className="absolute top-6 w-[150px] right-0 group-hover:opacity-100 group-hover:z-20 -z-10 opacity-0 hover:opacity-100 transition-opacity">
        {/* dropdown */}
        <div className="flex flex-col mt-2.5 bg-gray-150 border-b-[3px] py-2 border-b-second-green">
          <Link
            href="/user-settings?pageBookmark=1&nameBookmark="
            className="w-full px-6 py-1.5 text-sm font-bold cursor-pointer text-start hover:text-second-green select-none"
            onClick={() => dispatch(setMenu("bookmarks"))}
          >
            Tủ Truyện
          </Link>
          <Link
            href="/user-settings"
            className="w-full px-6 py-1.5 text-sm font-bold cursor-pointer text-start hover:text-second-green select-none"
            onClick={() => dispatch(setMenu("account"))}
          >
            Cài Đặt
          </Link>
          <Link
            href="/user-settings?pageHistory=1&nameHistory="
            className="w-full px-6 py-1.5 text-sm font-bold cursor-pointer text-start hover:text-second-green select-none"
            onClick={() => dispatch(setMenu("history"))}
          >
            Lịch sử
          </Link>
          {user?.role === "admin" && (
            <Link
              href="/user-settings"
              className="w-full px-6 py-1.5 text-sm font-bold cursor-pointer text-start hover:text-second-green select-none"
              onClick={() => dispatch(setMenu("addManga"))}
            >
              Tạo truyện
            </Link>
          )}
          {user?.role === "admin" && (
            <Link
              href="/user-settings?time=oneWeek&pageChart=1&nameChart="
              className="w-full px-6 py-1.5 text-sm font-bold cursor-pointer text-start hover:text-second-green select-none"
              onClick={() => {
                dispatch(setMenu("chart"))
              }}
            >
              Thống kê
            </Link>
          )}
          <div className="w-full px-6 py-1.5 text-sm font-bold cursor-pointer text-start hover:text-second-green select-none" onClick={async () => {
            const result = await fetch(`/api/user/log_out`)
            const res = await result.json()
            console.log("🚀 ~ file: user-menu.tsx:15:", res)
            if (res.message === "Logged Out") {
              if (router.pathname === "/user-settings") {
                router.push("/")
              }
              dispatch(setUser(initialUserState))
              // router.replace(`${router.asPath}`, "", { scroll: false })
            }
          }}
          >
            Đăng Xuất
          </div>
        </div>
      </div>
    </button>
  )
}