import { useSelector, useDispatch } from "react-redux"
import { selectSignIn, toggleSignIn, toggleResetPassword } from "@/features/GlobalSlice"
import { NormalResponse, emailReg, passwordReg, UserResponse } from "@/type"
import Input from "./input"
import { useState, useEffect, useRef } from "react"
import { setUser } from "@/features/UserSlice"
import { PulseLoader } from "react-spinners"
import { useOnClickOutside } from 'usehooks-ts'
import CloseButton from "./close-button"
import { useKeyPressEscape } from "@/hooks/useKeyPressEscape"
import { toast } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion"

export default function SignIn() {
  const showSignIn = useSelector(selectSignIn)
  const dispatch = useDispatch()
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [emailValid, setEmailValid] = useState<boolean>(true)
  const [passwordValid, setPasswordValid] = useState<boolean>(true)
  const [wrongInformation, setWrongInformation] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)
  useOnClickOutside(formRef, () => dispatch(toggleSignIn(false)))
  const emailChange = (value: string) => {
    setEmail(value)
    setEmailValid(() => value.match(emailReg) ? true : false)
  }
  const passwordChange = (value: string) => {
    setPassword(value)
    setPasswordValid(() => value.match(passwordReg) ? true : false)
  }
  useEffect(() => {
    if (email || password) {
      setWrongInformation(false)
    }
  }, [email, password])
  useKeyPressEscape(() => dispatch(toggleSignIn(false)))
  return (
    <AnimatePresence>
      {showSignIn && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="px-4 ease-out w-full fixed bg-[rgba(0,0,0,0.6)] grid py-14 md:py-0 justify-items-center items-start md:place-items-center z-50"
          style={{ height: "100dvh" }}
        >
          <form
            ref={formRef}
            className="bg-search dark:bg-none rounded dark:bg-neutral-750 w-full sm:max-w-[500px] md:max-w-[650px] px-8 md:px-28 flex flex-col gap-y-5 pt-7 pb-12 relative"
            onSubmit={async (e) => {
              e.preventDefault()
              setIsLoading(true)
              const formData = new FormData(e.currentTarget)
              const res = await fetch(`/api/sign_in`, {
                method: "POST",
                body: formData
              })
              const result: NormalResponse = await res.json()
              console.log("🚀 ~ file: sign-in.tsx:48 ~ onSubmit={ ~ res:", result)
              if (result.message) {
                const userResult = await fetch(`/api/user/account`)
                const userRes = await userResult.json()
                dispatch(setUser(userRes.data))
                setIsLoading(false)
                setEmail("")
                setPassword("")
                dispatch(toggleSignIn(false))
                toast.success("Đăng nhập thành công")
              } else if (result.error) {
                alert(result.error)
                setIsLoading(false)
                setWrongInformation(true)
              }
            }}
          >
            <CloseButton handleOnClick={() => dispatch(toggleSignIn(false))} />
            <p className="text-xl font-bold text-center uppercase">Đăng Nhập</p>
            <Input
              content="Email"
              type="text"
              name="email"
              value={email}
              handleOnChange={emailChange}
              valid={emailValid}
              validContent="Email không hợp lệ"
            >
              <p className={`${!wrongInformation ? "hidden" : "block"} text-red-500 text-sm`}>Sai tên đăng nhập hoặc mật khẩu</p>
            </Input>
            <Input
              content="Mật khẩu"
              type="password"
              name="password"
              value={password}
              handleOnChange={passwordChange}
              valid={passwordValid}
              validContent="Độ dài tối thiểu là 8 ký tự"
            >
              <p className={`${!wrongInformation ? "hidden" : "block"} text-red-500 text-sm`}>Sai tên đăng nhập hoặc mật khẩu</p>
            </Input>
            <div className="flex flex-row items-center gap-x-1">
              <input type="checkbox" name="remember" id="remember" />
              <label className="select-none grow" htmlFor="remember">Lưu thông tin</label>
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className={`${!passwordValid || !emailValid ? "bg-red-500" : "bg-second-green"} ${isLoading || !passwordValid || !emailValid ? "" : "hover:bg-black"} font-bold rounded-full text-white w-[140px] h-[48px] transition-colors relative`}
                disabled={!passwordValid || !emailValid || isLoading}
              >
                {isLoading ? (
                  <PulseLoader className="absolute -translate-x-1/2 top-1/2 left-1/2 -translate-y-1/3" color="#ffffff" size={10} margin={4} />
                ) : <p>Đăng nhập</p>}
              </motion.button>
            </div>
            <button
              type="button"
              className="text-start hover:text-second-green dark:hover:text-third-green" onClick={() => {
                dispatch(toggleSignIn(false))
                setTimeout(() => {
                  dispatch(toggleResetPassword(true))
                }, 200)
              }}
            >
              Quên mật khẩu?
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}