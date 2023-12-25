import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Menu from '@/components/global/menu/Menu'
import { Provider } from 'react-redux'
import store from '@/store'
import mockRouter from "next-router-mock"
import DarkMode from "@/components/global/darkMode/DarkMode"
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';

const menu = (
  <Provider store={store}>
    <DarkMode>
      <Menu />
    </DarkMode>
  </Provider>
)

test("test search box", async () => {
  mockRouter.push("/")
  const { getByRole, findByRole } = render(menu)
  // search box được lazy load nên phải đợi 1 await
  expect(await findByRole("search-box")).toBeInTheDocument()
  expect(parseFloat(window.getComputedStyle(getByRole("search-box")).maxHeight)).toBe(0)
  // test open search box
  await userEvent.click(getByRole("menu-search-button"))
  expect(parseFloat(window.getComputedStyle(await findByRole("search-box")).maxHeight)).toBeGreaterThan(0)
  // test close search box
  await userEvent.click(getByRole("menu-search-button"))
  expect(parseFloat(window.getComputedStyle(await findByRole("search-box")).maxHeight)).toBe(0)
  // check khả năng tìm kiếm
  await userEvent.click(getByRole("menu-search-button"))
  await userEvent.type(getByRole("search-box-input"), "manga")
  await userEvent.type(getByRole("search-box-input"), "{enter}")
  expect(mockRouter).toMatchObject({
    asPath: "/search?name=manga",
    pathname: "/search",
    query: { name: "manga" }
  })
}, 10000)

test("test theme button", async () => {
  const { getByRole, findByRole } = render(menu)
  const themeButton = getByRole("theme-button")
  const themeContainer = getByRole("theme-container")
  const darkMode = themeContainer.getAttribute("data-darkmode")

  expect(themeButton).toBeInTheDocument()
  await userEvent.click(themeButton)
  if (darkMode) {
    expect(themeContainer).toHaveAttribute("data-darkmode", "false")
  } else {
    expect(themeContainer).toHaveAttribute("data-darkmode", "true")
  }
})

test("test menu button", async () => {
  mockRouter.push("/")
  const { getByRole } = render(menu, { wrapper: MemoryRouterProvider })
  // trang chủ menu
  await userEvent.click(getByRole("logo-button-menu"))
  expect(mockRouter.asPath).toEqual("/")

  // trang chủ menu
  await userEvent.click(screen.getByRole("home-button-menu"))
  expect(mockRouter.asPath).toEqual("/")

  // manga mới cập nhật menu
  await userEvent.click(screen.getByRole("manga-latest-button-menu"))
  expect(mockRouter.asPath).toEqual("/manga?page=1&sort=latest")

  // manga hot menu
  await userEvent.click(screen.getByRole("manga-hot-button-menu"))
    expect(mockRouter.asPath).toEqual("/manga?page=1&sort=views")

  // manga mới menu
  await userEvent.click(screen.getByRole("manga-new-button-menu"))
    expect(mockRouter.asPath).toEqual("/manga?page=1&sort=new")
})
