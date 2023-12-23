import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Menu from '@/components/global/menu/Menu'
import { Provider } from 'react-redux'
import store from '@/store'
import mockRouter from "next-router-mock"
import DarkMode from "@/components/global/darkMode/DarkMode"
import { secureHeapUsed } from 'crypto'

const menu = (
  <Provider store={store}>
    <DarkMode>
      <Menu />
    </DarkMode>
  </Provider>
)

beforeEach(() => {
  mockRouter.push("/")
  render(menu)
})

test("nhấn nút tìm kiếm để mở search box và nhập text để tìm kiếm", async () => {

  const searchButton = screen.getByRole("menu-search-button")
  const searchBox = screen.queryByRole("search-box")
  const maxHeight = parseFloat(window.getComputedStyle(screen.getByRole("search-box")).maxHeight)

  expect(maxHeight).toBe(0)
  // check max height của search box
  await userEvent.click(searchButton)
  setTimeout(() => {
    expect(maxHeight).toBeGreaterThan(0)
  }, 1000)
  // check khả năng toggle của button
  await userEvent.click(searchButton)
  setTimeout(() => {
    expect(maxHeight).toBe(0)
  }, 1000)
  // check khả năng tìm kiếm
  await userEvent.click(searchButton)
  await userEvent.type(screen.getByRole("search-box-input"), "manga")
  await userEvent.type(screen.getByRole("search-box-input"), "{enter}")
  expect(mockRouter).toMatchObject({
    asPath: "/search?name=manga",
    pathname: "/search",
    query: { name: "manga" }
  })
})

test("nhấn nút đổi theme để đổi chủ đề", async () => {
  const themeButton = screen.getByRole("theme-button")
  const themeContainer = screen.getByRole("theme-container")
  const darkMode = themeContainer.getAttribute("data-darkmode")

  expect(themeButton).toBeInTheDocument()
  await userEvent.click(themeButton)
  if (darkMode) {
    expect(themeContainer).toHaveAttribute("data-darkmode", "false")
  } else {
    expect(themeContainer).toHaveAttribute("data-darkmode", "true")
  }
})

test.only("đường dẫn các nút trong menu", async () => {
  const logoButtonMenu = screen.getByRole("logo-button-menu")
  const homeButtonMenu = screen.getByRole("home-button-menu")
  const mangaLatestButtonMenu = screen.getByRole("manga-latest-button-menu")
  const mangaHotButtonMenu = screen.getByRole("manga-hot-button-menu")
  const mangaNewButtonMenu = screen.getByRole("manga-new-button-menu")

  // trang chủ menu
  await userEvent.click(logoButtonMenu)
  setTimeout(() => {
    expect(mockRouter).toMatchObject({
      path: "/",
      pathname: "/",
      query: {}
    })
  }, 1000)

  // trang chủ menu
  await userEvent.click(homeButtonMenu)
  setTimeout(() => {
    expect(mockRouter).toMatchObject({
      path: "/",
      pathname: "/",
      query: {}
    })
  }, 1000)

  // manga mới cập nhật menu
  await userEvent.click(mangaLatestButtonMenu)
  setTimeout(() => {
    expect(mockRouter).toMatchObject({
      path: "/manga?page=1&sort=latest",
      pathname: "/manga",
      query: { page: "1", sort: "latest" }
    })
  }, 1000)

  // manga hot menu
  await userEvent.click(mangaHotButtonMenu)
  setTimeout(() => {
    expect(mockRouter).toMatchObject({
      path: "/manga?page=1&sort=hot",
      pathname: "/manga",
      query: { page: "1", sort: "hot" }
    })
  }, 1000)

  // manga mới menu
  await userEvent.click(mangaNewButtonMenu)
  setTimeout(() => {
    expect(mockRouter).toMatchObject({
      path: "/manga?page=1&sort=new",
      pathname: "/manga",
      query: { page: "1", sort: "new" }
    })
  }, 1000)
})