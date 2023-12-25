import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import SignUp from '@/components/global/signIn_signUp_resetPassword/SignUp'
import UserMenu from '@/components/global/userMenu/UserMenu'
import { Provider } from 'react-redux'
import store from '@/store'
import SignIn from '../SignIn'

const app = (
  <Provider store={store}>
    <SignIn />
    <SignUp />
    <UserMenu user={undefined} />
  </Provider>
)

test("test sign up", async () => {
  const { getByRole, findByRole, queryByRole, getByText } = render(app)
  expect(queryByRole("sign-up-form")).not.toBeInTheDocument()
  await userEvent.click(getByRole("sign-up-button"))
  expect(await findByRole("sign-up-form")).toBeInTheDocument()

  // test thông báo lỗi reg
  await userEvent.type(getByRole("username-sign-up-input"), "abc")
  await userEvent.type(getByRole("email-sign-up-input"), "abc@gmail")
  await userEvent.type(getByRole("password-sign-up-input"), "abcd")
  expect(getByText("Độ dài tối thiểu là 4 ký tự và không bao gồm ký tự đặc biệt")).toBeInTheDocument()
  expect(getByText("Email không hợp lệ")).toBeInTheDocument()
  expect(getByText("Độ dài tối thiểu là 8 ký tự")).toBeInTheDocument()
  expect(getByRole("submit-sign-up-button")).toBeDisabled()

  // test đóng sign up 
  await userEvent.click(getByRole("close-modal-button"))
  await waitForElementToBeRemoved(() => queryByRole("sign-up-form"))
  expect(queryByRole("sign-up-form")).not.toBeInTheDocument()
})