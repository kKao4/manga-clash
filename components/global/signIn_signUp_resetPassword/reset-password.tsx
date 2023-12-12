import { useDispatch, useSelector } from "react-redux"
import { selectResetPassword, toggleResetPassword } from "@/features/GlobalSlice"
import { useState, useEffect, useRef } from "react"
import Input from "./input"
import { emailReg } from "@/type"
import CloseButton from "./close-button"
import { PropagateLoader } from "react-spinners"
import { useOnClickOutside } from 'usehooks-ts'
import { useKeyPressEscape } from "@/hooks/useKeyPressEscape"
import { motion, AnimatePresence } from "framer-motion"

export default function ResetPassword() {
  const showResetPassword = useSelector(selectResetPassword)
  const dispatch = useDispatch()
  const [email, setEmail] = useState<string>("")
  const [emailValid, setEmailValid] = useState<boolean>(true)
  const [emailSent, setEmailSent] = useState<boolean>(false)
  const [emailNotFound, setEmailNotFound] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)
  useOnClickOutside(formRef, () => dispatch(toggleResetPassword(false)))
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
  useKeyPressEscape(() => dispatch(toggleResetPassword(false)))
  return (
    <AnimatePresence>
      {showResetPassword && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="px-4 w-full fixed bg-[rgba(0,0,0,0.6)] grid py-14 md:py-0 justify-items-center items-start md:place-items-center z-50 top-0"
          style={{ height: "100dvh" }}
        >
          <form
            ref={formRef}
            className="bg-search dark:bg-none rounded dark:bg-neutral-750 w-full sm:max-w-[500px] md:max-w-[650px] px-8 md:px-28 flex flex-col gap-y-5 pt-7 pb-12 relative"
            onSubmit={async (e) => {
              e.preventDefault()
              setIsLoading(true)
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
              setIsLoading(false)
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
                {/* Submit Btn */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className={`${!emailValid ? "bg-red-500" : "bg-second-green hover:bg-black"} relative w-full font-bold rounded-full text-white h-[48px] mt-2 transition-colors`}
                  disabled={!emailValid}
                >
                  {isLoading ? (
                    <PropagateLoader className="absolute -translate-x-1/2 left-1/2 -top-1" color="#ffffff" size={10} />
                  ) : "Gửi email cho tôi"}
                </motion.button>
              </>
            ) : (
              <p className="text-xl font-bold text-center uppercase">Vùi lòng kiểm tra email để nhận được hướng dẫn lấy lại mật khẩu</p>
            )}
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}