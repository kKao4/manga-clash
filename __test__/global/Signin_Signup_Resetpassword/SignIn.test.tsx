import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import SignIn from '@/components/global/signIn_signUp_resetPassword/sign-in'
import UserMenu from '@/components/global/userMenu/UserMenu'
import { Provider } from 'react-redux'
import store from '@/store'
import mockRouter from "next-router-mock"

const signIn = (
  <Provider store={store}>
    <SignIn />
    <UserMenu user={undefined} />
  </Provider>
)

beforeEach(() => {
  mockRouter.push("/")
  render(signIn)
})

test("mở sign in và nhập dữ liệu đăng nhập", async () => {
  const signInButton = screen.getByRole("sign-in-button")
  const signInForm = screen.queryByRole("sign-in-form")
  const emailSignInInput = screen.queryByRole("email-sign-in-input")
  const passwordSignInInput = screen.queryByRole("password-sign-in-input")
  const submitSignInButton = screen.queryByRole("submit-sign-in-button")
  const resetPasswordSignInButton = screen.queryByRole("reset-password-sign-in-button")
  const resetPasswordForm = screen.queryByRole("reset-password-form")
  const closeModalButton = screen.queryByRole("close-modal-button")

  expect(signInForm).not.toBeInTheDocument()
  await userEvent.click(signInButton)
  setTimeout(() => {
    expect(signInForm).toBeInTheDocument()
  }, 1000)
  if (emailSignInInput && passwordSignInInput && submitSignInButton && resetPasswordSignInButton && closeModalButton) {
    // test đăng nhập
    await userEvent.type(emailSignInInput, "admin@gmail.com")
    await userEvent.type(passwordSignInInput, "admin1234")
    await userEvent.click(submitSignInButton)
    setTimeout(() => {
      expect(signInForm).not.toBeInTheDocument()
    }, 1000)
    // test thông báo lỗi
    await userEvent.type(emailSignInInput, "admin@gmail")
    expect(screen.getByText("Email không hợp lệ")).toBeInTheDocument()
    await userEvent.type(passwordSignInInput, "admin")
    expect(screen.getByText("Độ dài tối thiểu là 8 ký tự")).toBeInTheDocument()
    expect(submitSignInButton).toBeDisabled()
    // test mở quên mật khẩu
    await userEvent.click(resetPasswordSignInButton)
    setTimeout(() => {
      expect(resetPasswordForm).toBeInTheDocument()
    }, 1000)
    // test đóng sign in
    await userEvent.click(closeModalButton)
    setTimeout(() => {
      expect(signInForm).not.toBeInTheDocument()
    }, 1000)
  } else {
    expect(customErrorFunction).toThrow("elements are not exist")
  }
})

function customErrorFunction() {
  throw new Error("elements are not exist");
}