import { useSelector } from "react-redux"
import { selectDarkMode } from "@/features/GlobalSlice"
import { useEffect } from "react"
import Scrollbar from 'smooth-scrollbar';

export default function DarkMode({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    Scrollbar.initAll()
  })
  const darkMode = useSelector(selectDarkMode)
  return (
    <div className={`${darkMode ? "dark" : "light"} overflow-auto max-h-screen`} data-scrollbar>
      {children}
    </div>
  )
}