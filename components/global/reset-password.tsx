import { useDispatch, useSelector } from "react-redux"
import { selectResetPassword, toggleResetPassword } from "@/features/GlobalSlice"
import { useState, useEffect } from "react"
import Input from "./input"
import {  emailReg } from "@/type"
import CloseButton from "./close-button"

export default function ResetPassword() {
  const showResetPassword = useSelector(selectResetPassword)
  const dispatch = useDispatch()
  const [email, setEmail] = useState<string>("")
  const [emailValid, setEmailValid] = useState<boolean>(false)
  const [emailSent, setEmailSent] = useState<boolean>(false)
  const [emailNotFound, setEmailNotFound] = useState<boolean>(false)
  const emailChange = (value: string) => {
    setEmail(value)
    setEmailValid(() => value.match(emailReg) ? true : false)
  }
  const handleClose = () => {
    dispatch(toggleResetPassword(false))
    setEmailSent(false)
    setEmail("")
  }
  useEffect(() => {
    if (email) {
      setEmailNotFound(false)
    }
  }, [email])
  return (
    <>
      <div className={`${showResetPassword ? "translate-x-0 opacity-100 z-50" : "-translate-x-full opacity-0 -z-10"} transition-opacity px-4 duration-400 w-full h-screen fixed bg-[rgba(0,0,0,0.6)] grid place-items-center`}>
        <form
          className="bg-search w-full sm:max-w-[500px] md:max-w-[650px] px-8 md:px-28 flex flex-col gap-y-5 pt-7 pb-12 relative"
          onSubmit={async (e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const result = await fetch(`/api/user/reset_password`, {
              method: "POST",
              body: formData
            })
            const res = await result.json()
            if (res.message === "Email Sent") {
              setEmailSent(true)
            } else if (res.error === "Invalid Email") {
              setEmailNotFound(true)
            }
            console.log("🚀 ~ file: lost-password.tsx:33 ~ onSubmit={ ~ res:", res)
          }}
        >
          <CloseButton handleOnClick={handleClose} />
          {!emailSent ? (
            <>
              <p className="text-xl font-bold text-center uppercase">QUÊN MẬT KHẨU?</p>
              <p className="text-red-500">Hãy nhập email mà bạn đã dùng để tạo tài khoản. Bạn sẽ nhận được tin nhắn hướng dẫn qua email</p>
              <Input
                content="Email"
                type="text"
                name="email"
                value={email}
                handleOnChange={emailChange}
                valid={emailValid}
                validContent="Email không hợp lệ"
              >
                <p className={`${emailNotFound ? "block" : "hidden"} text-red-500 text-sm`}>Email chưa được đăng ký</p>
              </Input>
              <button
                type="submit"
                className={`${!emailValid ? "bg-red-500" : "bg-second-green hover:bg-black"} w-full font-bold rounded-full text-white py-2.5 mt-2 transition-colors`}
                disabled={!emailValid}
              >
                Gửi email cho tôi
              </button>
            </>
          ) : (
            <p className="text-xl font-bold text-center uppercase">Vùi lòng kiểm tra email để nhận được hướng dẫn lấy lại mật khẩu</p>
          )}
        </form>
      </div>
    </>
  )
}