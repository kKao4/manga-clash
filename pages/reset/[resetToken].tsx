import {  passwordReg } from "@/type"
import { useRouter } from "next/router"
import { useState } from "react"
import Head from "next/head"

const Page = () => {
  const router = useRouter()
  const [passwordValid, setPasswordValid] = useState<boolean>(false)
  const [passwordRepeatValid, setPasswordRepeatValid] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("")
  const [passwordRepeat, setPasswordRepeat] = useState<string>("")
  const [changedPassword, setChangedPassword] = useState<boolean>(false)
  return (
    <>
      <Head>
        <title>Thay đổi mật khẩu</title>
      </Head>
      <main className="w-full pt-7 px-4 pb-12">
        <div className="mx-auto w-full sm:max-w-[500px]">
          <p className="mb-4 text-xl font-bold text-center uppercase">{changedPassword ? "Changed password success" : "Reset Password"}</p>
          {!changedPassword && (
            <form className="flex flex-col gap-y-4" onSubmit={async (e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const resetToken = router.query.resetToken
              const result = await fetch(`/api/reset/${resetToken}`, {
                method: "POST",
                body: formData
              })
              const res = await result.json()
              console.log("🚀 ~ file: [resetToken].tsx:23 ~ res:", res)
              if (res.message === "Changed Password") {
                setChangedPassword(true)
              } else if (res.error) {
                alert(res.error)
              }
            }}>
              <div className="flex flex-col gap-y-2">
                <div className="space-x-1">
                  <label htmlFor="newPassword" className="inline-block font-bold">Enter your new password</label>
                  <span className="inline-block font-bold">*</span>
                </div>
                <input
                  type="password"
                  id="newPassword"
                  name="password"
                  className={`${!passwordValid ? "border-red-500 border" : ""} px-4 py-3 w-full focus:outline-none rounded tracking-[2px]`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setPasswordValid(() => e.target.value.match(passwordReg) ? true : false)
                    setPasswordRepeatValid(() => passwordRepeat === e.target.value ? true : false)
                  }}
                  required
                  autoFocus
                />
                <p className={`${passwordValid ? "hidden" : "block"} text-red-500 text-sm`}>Độ dài tối thiểu là 8 ký tự</p>
              </div>
              <div className="flex flex-col gap-y-2">
                <div className="space-x-1">
                  <label htmlFor="newPassword" className="inline-block font-bold">Confirm your new password</label>
                  <span className="inline-block font-bold">*</span>
                </div>
                <input
                  type="password"
                  id="newPassword"
                  name="password"
                  className={`${!passwordRepeatValid ? "border-red-500 border" : ""} px-4 py-3 w-full focus:outline-none rounded tracking-[2px]`}
                  value={passwordRepeat}
                  onChange={(e) => {
                    setPasswordRepeat(e.target.value)
                    setPasswordRepeatValid(() => password === e.target.value ? true : false)
                  }}
                  required
                  autoFocus
                />
                <p className={`${passwordRepeatValid ? "hidden" : "block"} text-red-500 text-sm`}>Mật khẩu nhập lại không khớp</p>
              </div>
              <button
                type="submit"
                className={`${!passwordValid || !passwordRepeatValid ? "bg-red-500" : "bg-second-green hover:bg-black"} w-full font-bold rounded text-white py-2.5 mt-2 transition-colors`}
                disabled={!passwordValid || !passwordRepeatValid}
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </main>
    </>
  )
}

export default Page