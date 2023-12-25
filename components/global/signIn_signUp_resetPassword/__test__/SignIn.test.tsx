import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import SignIn from '@/components/global/signIn_signUp_resetPassword/SignIn'
import UserMenu from '@/components/global/userMenu/UserMenu'
import { Provider } from 'react-redux'
import store from '@/store'
import ResetPassword from '../ResetPassword'

const app = (
  <Provider store={store}>
    <SignIn />
    <ResetPassword />
    <UserMenu user={undefined} />
  </Provider>
)

test("test sign in", async () => {
  const { queryByRole, getByRole, findByRole, getByText } = render(app)
  expect(queryByRole("sign-in-form")).not.toBeInTheDocument()
  await userEvent.click(getByRole("sign-in-button"))
  expect(await findByRole("sign-in-form")).toBeInTheDocument()

  // test đăng nhập
  // await userEvent.type(getByRole("email-sign-in-input"), "admin@gmail.com")
  // await userEvent.type(getByRole("password-sign-in-input"), "admin1 234")
  // await userEvent.click(getByRole("submit-sign-in-button"))
  // setTimeout(() => {
  //   expect(getByRole("sign-in-form")).not.toBeInTheDocument()
  // }, 1000)

  // test thông báo lỗi reg
  await userEvent.type(getByRole("email-sign-in-input"), "admin@gmail")
  expect(getByText("Email không hợp lệ")).toBeInTheDocument()
  await userEvent.type(getByRole("password-sign-in-input"), "admin")
  expect(getByText("Độ dài tối thiểu là 8 ký tự")).toBeInTheDocument()
  expect(getByRole("submit-sign-in-button")).toBeDisabled()

  // test đóng sign in
  await userEvent.click(getByRole("close-modal-button"))
  await waitForElementToBeRemoved(() => queryByRole("sign-in-form"))
  expect(queryByRole("sign-in-form")).not.toBeInTheDocument()
})