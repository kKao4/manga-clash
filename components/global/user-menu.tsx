import { useDispatch, useSelector } from "react-redux"
import { selectAdminMode, toggleAdminMode, toggleSignIn, toggleSignUp } from "@/features/GlobalSlice"
import UserDropdown from "./user-dropdown"
import { UserResponse } from "@/type"

export default function UserMenu({ user }: { user: UserResponse["data"] }) {
  const dispatch = useDispatch()
  const adminMode = useSelector(selectAdminMode)
  return (
    <div className="w-full border-b dark:border-neutral-700">
      <div className="xl:max-w-[1160px] lg:max-w-[900px] mx-auto px-4 flex flex-row items-center">
        {user?.role === "admin" && (
          <button
            className={`relative ${adminMode ? "bg-second-green" : "bg-gray-200"} w-[93px] sm:w-[82px] h-7 rounded-full text-xs gap-x-1 transition-all text-white text-start px-1.5 flex flex-row items-center`}
            onClick={() => dispatch(toggleAdminMode())}
          >
            <div className={`absolute w-5 h-5 rounded-full bg-white transition-all duration-300 ${adminMode ? "left-[53px]" : "left-1"}`}></div>
            <span className={`${adminMode ? "opacity-100" : "opacity-0"} absolute transition-opacity duration-200 font-bold left-2`}>Admin</span>
            <span className={`${!adminMode ? "opacity-100" : "opacity-0"} absolute transition-opacity duration-200 font-bold right-3.5`}>User</span>
          </button>
        )}
        <div className={`flex flex-row items-center w-full py-1 md:py-2 gap-x-2 ${!user?.username ? "justify-center" : "justify-end"}`}>
          {!user?.username ? (
            <>
              <button
                className="px-3 py-1 text-sm font-bold text-gray-200 transition-colors border-2 border-gray-200 rounded-full dark:text-neutral-300 dark:text hover:border-black dark:hover:bg-neutral-700 dark:hover:text-neutral-200 dark:hover:border-neutral-700 dark:border-neutral-600 hover:text-white hover:bg-black"
                onClick={() => dispatch(toggleSignIn(true))}
              >
                Đăng nhập
              </button>
              <button
                className="px-3 py-1 text-sm font-bold text-gray-200 transition-colors border-2 border-gray-200 rounded-full dark:text-neutral-300 hover:border-black hover:text-white dark:hover:bg-neutral-700 dark:hover:text-neutral-200 dark:border-neutral-600 dark:hover:border-neutral-700 hover:bg-black"
                onClick={() => dispatch(toggleSignUp(true))}
              >
                Đăng ký
              </button>
            </>
          ) : (
            <>
              {user && (
                <UserDropdown user={user} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}