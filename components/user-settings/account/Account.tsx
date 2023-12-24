import blankProfile from "@/assets/blank-profile-picture_640.webp"
import { UserResponse, emailReg, passwordReg, usernameReg } from "@/type"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/router"
import Row from "./Row"
import Input from "./Input"
import { useSelector, useDispatch } from "react-redux"
import { setUser } from "@/features/UserSlice"
import { ClipLoader, PuffLoader } from "react-spinners"
import { toast } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion"

export async function fetchUser() {
  const result = await fetch(`/api/user/account`)
  const res = await result.json()
  return res
}

export default function Account({ user }: { user: UserResponse["data"] }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [username, setUsername] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [oldPassword, setOldPassword] = useState<string>("")
  // const [fileValid, setFileValid] = useState<boolean>(true)
  const [passwordRepeat, setPasswordRepeat] = useState<string>("")
  const [usernameValid, setUsernameValid] = useState<boolean>(true)
  const [emailValid, setEmailValid] = useState<boolean>(true)
  const [passwordValid, setPasswordValid] = useState<boolean>(true)
  const [passwordRepeatValid, setPasswordRepeatValid] = useState<boolean>(true)
  const [wrongPassword, setWrongPassword] = useState<boolean>(false)
  const [changedPassword, setChangedPassword] = useState<boolean>(false)
  const [isLoadingProfilePicture, setIsLoadingProfilePicture] = useState<boolean>(false)
  const [isLoadingUsername, setIsLoadingUsername] = useState<boolean>(false)
  const [isLoadingEmail, setIsLoadingEmail] = useState<boolean>(false)
  const [isLoadingPassword, setIsLoadingPassword] = useState<boolean>(false)
  const fileRef = useRef<HTMLInputElement>(null)
  return (
    <>
      <div className="flex flex-col">
        {/* profile picture */}
        <div className="flex flex-row pb-6 border-b dark:border-neutral-700 gap-x-5">
          <div className="basis-1/3 w-[191px] h-[191px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={user?.profilePicture.url}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative flex h-full overflow-hidden place-items-center"
              >
                {!user?.profilePicture.url ? (
                  <Image className="object-fill" src={blankProfile} alt="" fill={true} quality={0} />
                ) : (
                  <Image className="object-fill" src={user.profilePicture.url} alt="" fill={true} quality={100} priority={true} />
                )}
                <div className={`${isLoadingProfilePicture ? "block" : "hidden"} absolute w-[191px] h-[191px] bg-black/50 flex justify-center items-center`}>
                  <ClipLoader color="#ffffff" size={40} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="py-2 basis-2/3">
            <p className="mb-3">Chỉ chấp nhận file .jpg .png hoặc .gif</p>
            <form onSubmit={async (e) => {
              e.preventDefault()
              setIsLoadingProfilePicture(true)
              const formData = new FormData(e.currentTarget)
              // console.log("🚀 ~ file: account.tsx:21 ~ <formonSubmit={ ~ formData:", [...formData])
              const result = await fetch(`/api/user/actions/update/profile_picture`, {
                method: "POST",
                body: formData
              })
              const res = await result.json()
              console.log("🚀 ~ file: account.tsx:29 ~ <formonSubmit={ ~ res:", res)
              if (res.message && file) {
                const res = await fetchUser()
                dispatch((setUser(res.data)))
                setIsLoadingProfilePicture(false)
                setFile(null)
                if (fileRef.current) {
                  fileRef.current.value = ""
                }
                toast.success("Thay đổi ảnh đại diện thành công")
              } else if (res.error) {
                alert(res.error)
                router.push("/")
              }
            }}>
              <label className="text-sm px-3 py-1.5 border border-gray-200 rounded cursor-pointer hover:border-second-green group transition-colors">
                <input
                  className="hidden"
                  type="file"
                  ref={fileRef}
                  name="profilePicture"
                  onChange={(e) => {
                    if (e.target.files) {
                      setFile(e.target.files[0])
                    }
                  }}
                  required
                />
                <span className="text-sm text-gray-200 transition-colors select-none dark:text-neutral-400 group-hover:text-second-green">Chọn file</span>
              </label>
              <span className={`ml-2 text-sm text-gray-200 dark:text-neutral-400`}>{!file ? "Không có file nào được chọn" : file.name}</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className={`bg-second-green hover:bg-black block px-3.5 py-1.5 mt-4 text-sm font-bold text-white transition-colors rounded-full`}
              >
                Thay Đổi
              </motion.button>
            </form>
          </div>
        </div>
        {/* username */}
        <Row header="Thay Đổi Tên Hiển Thị" valid={usernameValid} isLoading={isLoadingUsername} handleOnSubmit={async (e) => {
          e.preventDefault()
          setIsLoadingUsername(true)
          setUsername("")
          const result = await fetch(`/api/user/actions/update/username`, {
            method: "POST",
            body: JSON.stringify({
              username: username
            }),
            headers: {
              "Content-Type": "application/json"
            }
          })
          const res = await result.json()
          console.log("🚀 ~ file: account.tsx:64 ~ <Rowheader=", res)
          if (res.message) {
            const res = await fetchUser()
            dispatch((setUser(res.data)))
            toast.success("Thay đổi tên tài khoản thành công")
          } else if (res.error) {
            alert(res.error)
            router.push("/")
          }
          setIsLoadingUsername(false)
        }}>
          <Input label="Tên Hiển Thị Hiện Tại">
            <AnimatePresence mode="wait">
              <motion.p
                key={user?.username}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`relative w-full text-sm font-bold sm:w-auto ${isLoadingUsername && "opacity-60 dark:opacity-50"}`}
              >
                {user?.username}
              </motion.p>
            </AnimatePresence>
            <div className="ml-1">
              {isLoadingUsername && <PuffLoader size={20} color="#409a88" />}
            </div>
          </Input>
          <Input label="Tên Hiển Thị Mới">
            <input
              type="text"
              value={username}
              className={`${usernameValid ? "border-gray-200 dark:border-transparent" : "border-red-500"} px-3.5 py-2 dark:bg-neutral-700 rounded w-full sm:w-auto grow sm:mr-4 focus:outline-none border`}
              onChange={(e) => {
                setUsername(e.target.value)
                setUsernameValid(() => e.target.value.match(usernameReg) ? true : false)
              }}
              required
            />
          </Input>
          <div className={`${usernameValid ? "hidden" : "block"} text-sm text-red-500 -mt-8`}>Độ dài tối thiểu là 4 ký tự và không bao gồm ký tự đặc biệt</div>
        </Row >
        {/* email address */}
        <Row header="Thay Đổi Địa Chỉ Email" valid={emailValid} isLoading={isLoadingEmail} handleOnSubmit={async (e) => {
          e.preventDefault()
          setIsLoadingEmail(true)
          setEmail("")
          const result = await fetch(`/api/user/actions/update/email`, {
            method: "POST",
            body: JSON.stringify({
              email: email
            }),
            headers: {
              "Content-Type": "application/json"
            }
          })
          const res = await result.json()
          console.log("🚀 ~ file: account.tsx:92 ~ <Rowheader=", res)
          if (res.message) {
            const res = await fetchUser()
            dispatch((setUser(res.data)))
            toast.success("Thay đổi địa chỉ email thành công")
          } else if (res.error) {
            alert(res.error)
            router.push("/")
          }
          setIsLoadingEmail(false)
        }}>
          <Input label="Địa Chỉ Email Hiện Tại">
            <AnimatePresence mode="wait">
              <motion.p
                key={user?.email}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`w-full text-sm font-bold sm:w-auto ${isLoadingEmail && "opacity-60 dark:opacity-50"}`}
              >
                {user?.email}
              </motion.p>
            </AnimatePresence>
            <div className="ml-1">
              {isLoadingEmail && <PuffLoader size={20} color="#409a88" />}
            </div>
          </Input>
          <Input label="Địa Chỉ Email Mới">
            <input
              type="text"
              className={`${emailValid ? "border-gray-200 dark:border-transparent" : "border-red-500"} px-3.5 py-2 dark:bg-neutral-700 rounded grow sm:mr-4 focus:outline-none w-full sm:w-auto border`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setEmailValid(() => e.target.value.match(emailReg) ? true : false)
              }}
              required
            />
          </Input>
          <div className={`${emailValid ? "hidden" : "block"} text-sm text-red-500 -mt-8`}>Email không hợp lệ</div>
        </Row >
        {/* password */}
        <Row header="Thay Đổi Mật Khẩu" valid={passwordValid && passwordRepeatValid} isLoading={isLoadingPassword} handleOnSubmit={async (e) => {
          e.preventDefault()
          setIsLoadingPassword(true)
          const result = await fetch(`/api/user/actions/update/password`, {
            method: "POST",
            body: JSON.stringify({
              oldPassword: oldPassword,
              password: password
            }),
            headers: {
              "Content-Type": "application/json"
            }
          })
          const res = await result.json()
          console.log("🚀 ~ file: account.tsx:139 ~ <Rowheader ~ res:", res)
          if (res.message === "Unverified") {
            setWrongPassword(true)
            setIsLoadingPassword(false)
            toast.error("Mật khẩu hiện tại không đúng")
          } else if (res.message.startsWith("Updated")) {
            setChangedPassword(true)
            setOldPassword("")
            setPassword("")
            setPasswordRepeat("")
            setIsLoadingPassword(false)
            toast.success("Thay đổi mật khẩu thành công")
          } else if (res.error) {
            alert(res.error)
            router.push("/")
          }
        }}>
          <Input label="Mật Khẩu Hiện Tại">
            <input
              type="password"
              className={`${!wrongPassword ? "border-gray-200 dark:border-transparent" : "border-red-500"} px-3.5 py-2 dark:bg-neutral-700 rounded grow sm:mr-4 focus:outline-none w-full sm:w-auto tracking-[2px] border`}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </Input>
          <Input label="Mật Khẩu Mới">
            <input
              type="password"
              className={`${passwordValid ? "border-gray-200 dark:border-transparent" : "border-red-500"} px-3.5 py-2 dark:bg-neutral-700 rounded grow sm:mr-4 focus:outline-none w-full sm:w-auto tracking-[2px] border`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setPasswordValid(() => e.target.value.match(passwordReg) ? true : false)
                setPasswordRepeatValid(() => e.target.value === passwordRepeat ? true : false)
              }}
              required
            />
          </Input>
          <Input label="Xác Nhận Lại Mật Khẩu">
            <input
              type="password"
              className={`${passwordRepeatValid ? "border-gray-200 dark:border-transparent" : "border-red-500"} px-3.5 py-2 dark:bg-neutral-700 rounded grow sm:mr-4 focus:outline-none w-full sm:w-auto tracking-[2px] border`}
              value={passwordRepeat}
              onChange={(e) => {
                setPasswordRepeat(e.target.value)
                setPasswordRepeatValid(() => e.target.value === password ? true : false)
              }}
              required
            />
          </Input>
          <div className={!wrongPassword && passwordValid && passwordRepeatValid && !changedPassword ? "hidden" : "block"}>
            <div className={`${!wrongPassword ? "hidden" : "block"} text-sm text-red-500`}>Mật khẩu hiện tại không đúng</div>
            <div className={`${passwordValid ? "hidden" : "block"} text-sm text-red-500`}>Độ dài tối thiểu là 8 ký tự</div>
            <div className={`${passwordRepeatValid ? "hidden" : "block"} text-sm text-red-500`}>Mật khẩu nhập lại không khớp</div>
            <div className={`${!changedPassword ? "hidden" : "block"} text-sm text-main-green`}>Mật khẩu đã thay đổi</div>
          </div>
        </Row>
      </div >
    </>
  )
}