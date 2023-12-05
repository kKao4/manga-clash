import { useDispatch } from "react-redux";
import { toggleSignUp, toggleSignIn, toggleResetPassword } from "@/features/GlobalSlice";
import { selectSignUp } from "@/features/GlobalSlice"
import { useSelector } from "react-redux"
import { useState, useEffect, useRef } from "react";
import { NormalResponse } from "@/type";
import Input from "./input";
import { usernameReg, passwordReg, emailReg } from "@/type";
import { PropagateLoader } from "react-spinners"
import { useOnClickOutside } from 'usehooks-ts'
import CloseButton from "./close-button";
import { useKeyPressEscape } from "@/hooks/useKeyPressEscape";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function SignUp() {
  const dispatch = useDispatch()
  const showSignUp = useSelector(selectSignUp)
  const [username, setUsername] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [usernameValid, setUsernameValid] = useState<boolean>(true)
  const [passwordValid, setPasswordValid] = useState<boolean>(true)
  const [emailValid, setEmailValid] = useState<boolean>(true)
  const [emailExits, setEmailExits] = useState<boolean>(false)
  const [signedUp, setSignedUp] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)
  const divRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(formRef, () => dispatch(toggleSignUp(false)))
  useOnClickOutside(divRef, () => dispatch(toggleSignUp(false)))
  const usernameChange = (value: string) => {
    setUsername(value)
    setUsernameValid(() => value.match(usernameReg) ? true : false)
  }
  const emailChange = (value: string) => {
    setEmail(value)
    setEmailValid(() => value.match(emailReg) ? true : false)
  }
  const passwordChange = (value: string) => {
    setPassword(value)
    setPasswordValid(() => value.match(passwordReg) ? true : false)
  }
  useEffect(() => {
    if (email) {
      setEmailExits(false)
    }
  }, [email])
  useKeyPressEscape(() => dispatch(toggleSignUp(false)))
  return (
    <AnimatePresence>
      {showSignUp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="z-50 px-4 w-full h-screen fixed bg-[rgba(0,0,0,0.6)] grid py-14 md:py-0 justify-items-center items-start md:place-items-center"
        >
          {!signedUp ? (
            <form
              ref={formRef}
              className="bg-search dark:bg-none rounded dark:bg-neutral-750 w-full sm:max-w-[500px] md:max-w-[650px] px-8 md:px-28 flex flex-col gap-y-5 pt-7 pb-12 relative"
              onSubmit={async (e) => {
                e.preventDefault()
                setIsLoading(true)
                const formData = new FormData(e.currentTarget)
                const res = await fetch(`/api/sign_up`, {
                  method: "POST",
                  body: formData
                })
                const result: NormalResponse = await res.json()
                console.log("🚀 ~ file: sign-up.tsx:38 ~ onSubmit={ ~ res:", result)
                if (result.message !== "Email Exits") {
                  toast.success("Đăng ký thành công")
                  setIsLoading(false)
                  setSignedUp(true)
                  setUsername("")
                  setEmail("")
                  setPassword("")
                  setUsernameValid(false)
                  setEmailValid(false)
                  setPasswordValid(false)
                } else {
                  setIsLoading(false)
                  setEmailExits(true)
                }
              }}
            >
              <CloseButton handleOnClick={() => {
                dispatch(toggleSignUp(false))
                setSignedUp(false)
              }} />
              <p className="text-xl font-bold text-center uppercase">Đăng Ký</p>
              <Input
                content="Tên người dùng"
                type="text"
                name="username"
                value={username}
                handleOnChange={usernameChange}
                valid={usernameValid}
                validContent="Độ dài tối thiểu là 4 ký tự và không bao gồm ký tự đặc biệt"
              />
              <Input
                content="Email"
                type="text"
                name="email"
                value={email}
                handleOnChange={emailChange}
                valid={emailValid}
                validContent="Email không hợp lệ"
              >
                <p className={`${!emailExits ? "hidden" : "block"} text-red-500 text-sm`}>Email đã đăng ký, vui lòng chuyển qua phần đăng nhập</p>
              </Input>
              <Input
                content="Mật khẩu"
                type="password"
                name="password"
                value={password}
                handleOnChange={passwordChange}
                valid={passwordValid}
                validContent="Độ dài tối thiểu là 8 ký tự"
              />
              {/* Sign Up Btn */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className={`${!usernameValid || !passwordValid || !emailValid ? "bg-red-500" : "bg-second-green"} ${isLoading || !usernameValid || !passwordValid || !emailValid ? "" : "hover:bg-black"} relative w-full font-bold rounded-full text-white h-[48px] mt-2 transition-colors`}
                disabled={!usernameValid || !passwordValid || !emailValid || isLoading}
              >
                {isLoading ? (
                  <PropagateLoader className="absolute left-1/2 -top-1 -translate-x-1/2" color="#ffffff" size={10} />
                ) : <p>Đăng ký</p>}
              </motion.button>
              <div>
                {/* Sign In Btn */}
                <button type="button" className="hover:text-second-green dark:hover:text-third-green" onClick={() => {
                  dispatch(toggleSignUp(false))
                  setTimeout(() => {
                    dispatch(toggleSignIn(true))
                  }, 200)
                }}>Đăng nhập</button>
                {/* Lost Password Btn */}
                <button
                  type="button"
                  className="float-right hover:text-second-green dark:hover:text-third-green"
                  onClick={() => {
                    dispatch(toggleSignUp(false))
                    setTimeout(() => {
                      dispatch(toggleResetPassword(true))
                    }, 200)
                  }}
                >
                  Quên mật khẩu?
                </button>
              </div>
            </form>
          ) : (
            <div
              ref={divRef}
              className="bg-search dark:bg-none dark:bg-neutral-750 w-[650px] px-32 pt-7 pb-12 space-y-4 relative"
            >
              <CloseButton handleOnClick={() => dispatch(toggleSignUp(false))} />
              <p className="text-2xl font-bold text-center">Đã đăng ký thành công!</p>
              <p className="text-center">Vùi lòng <span className="font-bold cursor-pointer text-main-green hover:text-third-green transition-colors" onClick={() => {
                dispatch(toggleSignUp(false))
                setTimeout(() => {
                  dispatch(toggleSignIn(true))
                  setSignedUp(false)
                }, 200)
              }}>Nhấn vào đây</span> để đăng nhập</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}