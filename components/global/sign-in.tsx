import { useSelector, useDispatch } from "react-redux"
import { selectSignIn, toggleSignIn, toggleResetPassword } from "@/features/GlobalSlice"
import { NormalResponse, emailReg, passwordReg, UserResponse } from "@/type"
import Input from "./input"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { setUser } from "@/features/UserSlice"
import { PulseLoader } from "react-spinners"

export default function SignIn() {
  const showSignIn = useSelector(selectSignIn)
  const dispatch = useDispatch()
  const router = useRouter()
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [emailValid, setEmailValid] = useState<boolean>(false)
  const [passwordValid, setPasswordValid] = useState<boolean>(false)
  const [wrongInformation, setWrongInformation] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const emailChange = (value: string) => {
    setEmail(value)
    setEmailValid(() => value.match(emailReg) ? true : false)
  }
  const passwordChange = (value: string) => {
    setPassword(value)
    setPasswordValid(() => value.match(passwordReg) ? true : false)
  }
  useEffect(() => {
    if (email && password) {
      setWrongInformation(false)
    }
  }, [email, password])
  return (
    <>
      <div className={`${showSignIn ? "translate-x-0 opacity-100 z-50" : "-translate-x-full opacity-0 -z-10"} transition-opacity px-4 duration-400 w-full h-screen fixed bg-[rgba(0,0,0,0.6)] grid place-items-center`}>
        <form
          // ref={ref}
          className="bg-[url(../assets/bg-search.jpg)] w-full sm:max-w-[500px] md:max-w-[650px] px-8 md:px-28 flex flex-col gap-y-5 pt-7 pb-12 relative"
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
              // router.replace(`${router.asPath}`, "", { scroll: false })
              setEmail("")
              setPassword("")
              dispatch(toggleSignIn(false))
            } else if (result.error) {
              alert(result.error)
              setIsLoading(false)
              setWrongInformation(true)
            }
          }}
        >
          <div className="absolute right-3 top-1.5 p-2 group cursor-pointer" onClick={() => dispatch(toggleSignIn(false))}>
            <svg className="h-6 fill-gray-200 group-hover:fill-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
          </div>
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
            <button
              type="submit"
              className={`${!passwordValid || !emailValid ? "bg-red-500" : "bg-second-green"} ${isLoading || !passwordValid || !emailValid ? "" : "hover:bg-black"} font-bold rounded-full text-white px-8 py-2.5 transition-colors`}
              disabled={!passwordValid || !emailValid || isLoading}
            >
              {isLoading ? (
                <PulseLoader color="#ffffff" size={10} margin={4} />
              ) : "Đăng nhập"}
            </button>
          </div>
          <button
            type="button"
            className="text-start hover:text-second-green" onClick={() => {
              dispatch(toggleSignIn(false))
              dispatch(toggleResetPassword(true))
            }}
          >
            Quên mật khẩu?
          </button>
        </form >
      </div >
    </>
  )
}