import { useDispatch } from "react-redux";
import { toggleSignUp, toggleSignIn, toggleResetPassword } from "@/features/GlobalSlice";
import { selectSignUp } from "@/features/GlobalSlice"
import { useSelector } from "react-redux"
import { useState, useEffect } from "react";
import { NormalResponse, HOST_URL } from "@/type";
import Input from "./input";
import { usernameReg, passwordReg, emailReg } from "@/type";
import { PropagateLoader } from "react-spinners"

export default function SignUp() {
  const dispatch = useDispatch()
  const showSignUp = useSelector(selectSignUp)
  const [username, setUsername] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [usernameValid, setUsernameValid] = useState<boolean>(false)
  const [passwordValid, setPasswordValid] = useState<boolean>(false)
  const [emailValid, setEmailValid] = useState<boolean>(false)
  const [emailExits, setEmailExits] = useState<boolean>(false)
  const [signedUp, setSignedUp] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
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
  return (
    <>
      <div className={`${showSignUp ? "translate-x-0 opacity-100 z-50" : "-translate-x-full opacity-0 -z-10"} transition-opacity px-4 duration-400 w-full h-screen fixed bg-[rgba(0,0,0,0.6)] grid place-items-center`}>
        {!signedUp ? (
          <form
            className="bg-[url(../assets/bg-search.jpg)] w-full sm:max-w-[500px] md:max-w-[650px] px-8 md:px-28 flex flex-col gap-y-5 pt-7 pb-12 relative"
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
            <div className="absolute right-3 top-1.5 p-2 group cursor-pointer" onClick={() => {
              dispatch(toggleSignUp(false))
              setSignedUp(false)
            }}>
              <svg className="h-6 fill-gray-200 group-hover:fill-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
            </div>
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
            <button
              type="submit"
              className={`${!usernameValid || !passwordValid || !emailValid ? "bg-red-500" : "bg-second-green"} ${isLoading || !usernameValid || !passwordValid || !emailValid ? "" : "hover:bg-black"} relative w-full font-bold rounded-full text-white py-[22px] mt-2 transition-colors`}
              disabled={!usernameValid || !passwordValid || !emailValid || isLoading}
            >
              {isLoading ? (
                <PropagateLoader color="#ffffff" size={10} />
              ) : <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Đăng ký</p>}
            </button>
            <div className="">
              <button type="button" className="hover:text-second-green" onClick={() => {
                dispatch(toggleSignUp(false))
                dispatch(toggleSignIn(true))
              }}>Đăng nhập</button>
              <button
                type="button"
                className="float-right hover:text-second-green"
                onClick={() => {
                  dispatch(toggleSignUp(false))
                  dispatch(toggleResetPassword(true))
                }}
              >
                Quên mật khẩu?
              </button>
            </div>
          </form>
        ) : (
          <div
            className="bg-[url(../assets/bg-search.jpg)] w-[650px] px-32 pt-7 pb-12 space-y-4"
          >
            <p className="text-2xl font-bold text-center">Đã đăng ký thành công!</p>
            <p className="text-center">Vùi lòng <span className="font-bold cursor-pointer text-main-green hover:text-second-green" onClick={() => {
              setSignedUp(false)
              dispatch(toggleSignUp(false))
              dispatch(toggleSignIn(true))
            }}>Nhấn vào đây</span> để đăng nhập</p>
          </div>
        )}
      </div>
    </>
  )
}