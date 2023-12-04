import { useDispatch, useSelector } from "react-redux"
import { selectAdminMode, toggleAdminMode, toggleSignIn, toggleSignUp } from "@/features/GlobalSlice"
import UserDropdown from "./UserDropdown"
import { UserResponse } from "@/type"
import Button from "./Button"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
const DynamicAdminToggleButton = dynamic(() => import("./ToggleAdminModeButton"), {
  ssr: false
})

export default function UserMenu({ user }: { user: UserResponse["data"] }) {
  const dispatch = useDispatch()
  const adminMode = useSelector(selectAdminMode)
  return (
    <div
      className="w-full border-b dark:border-neutral-700"
    >
      <div className="xl:max-w-[1150px] lg:max-w-[900px] mx-auto px-4 flex flex-row items-center">
        {user?.role === "admin" && (
          <DynamicAdminToggleButton adminMode={adminMode} handleOnClick={() => dispatch(toggleAdminMode())} />
        )}
        <div className={`flex flex-row items-center w-full py-1 md:py-2 gap-x-2 ${!user?.username ? "justify-center" : "justify-end"}`}>
          {!user?.username ? (
            <>
              <Button content="Đăng nhập" handleOnClick={() => dispatch(toggleSignIn(true))} />
              <Button content="Đăng ký" handleOnClick={() => dispatch(toggleSignUp(true))} />
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