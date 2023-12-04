import { UserResponse } from "@/type";
import { useRouter } from "next/router";
import { setMenu } from "@/features/user-settings/UserSettingsSlice";
import { useDispatch } from "react-redux";
import Image from "next/image";
import blankProfile from "@/assets/blank-profile-picture_640.webp"
import { initialUserState, setUser } from "@/features/UserSlice";
import LinkDropdown from "./LinkDropdown";

export default function UserDropdown({ user }: { user: UserResponse["data"] }) {
  const router = useRouter()
  const dispatch = useDispatch()
  return (
    <div className="relative flex flex-row items-center text-gray-200 dark:text-neutral-300 gap-x-2 cursor-pointer group">
      <p className="font-normal">Xin chào, {user?.role === "admin" ? "admin" : ""} <span className="font-semibold text-main-green">{user?.username}</span></p>
      {/* profile picture */}
      <div className="relative w-8 h-8 overflow-hidden border rounded-full dark:border-neutral-700">
        {user?.profilePicture.url ? (
          <Image src={user.profilePicture.url} alt="profile picture" fill={true} className="object-fill" quality={0} />
        ) : (
          <Image src={blankProfile} alt="" fill={true} className="object-fill" quality={0} />
        )}
      </div>
      <div className="absolute top-6 w-[150px] right-0 opacity-0 group-hover:opacity-100 -z-10 group-hover:z-20 overflow-hidden ease-out duration-300 transition-all">
        {/* dropdown */}
        <div className="flex flex-col mt-2.5 bg-gray-150 dark:bg-neutral-700 border-b-[3px] py-2 border-b-second-green">
          <LinkDropdown content="Tủ Truyện" href="/user-settings?pageBookmark=1&nameBookmark=" handleOnClick={() => dispatch(setMenu("bookmarks"))} />
          <LinkDropdown content="Cài Đặt" href="/user-settings" handleOnClick={() => dispatch(setMenu("account"))} />
          <LinkDropdown content="Lịch Sử" href="/user-settings?pageHistory=1&nameHistory=" handleOnClick={() => dispatch(setMenu("history"))} />
          {user?.role === "admin" && (
            <LinkDropdown
              content="Tạo Truyện"
              href="/user-settings"
              handleOnClick={() => dispatch(setMenu("addManga"))}
            />
          )}
          {user?.role === "admin" && (
            <LinkDropdown
              content="Thống Kê"
              href="/user-settings?time=oneWeek&pageChart=1&nameChart="
              handleOnClick={() => dispatch(setMenu("chart"))}
            />
          )}
          <LinkDropdown
            content="Đăng Xuất"
            handleOnClick={async () => {
              const result = await fetch(`/api/user/log_out`)
              const res = await result.json()
              console.log("🚀 ~ file: user-menu.tsx:15:", res)
              if (res.message === "Logged Out") {
                if (router.pathname === "/user-settings") {
                  router.push("/")
                }
                dispatch(setUser(initialUserState))
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}