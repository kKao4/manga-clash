import { useSelector } from "react-redux"
import { selectDarkMode } from "@/features/GlobalSlice"

export default function DarkMode({ children }: { children: React.ReactNode }) {
  const darkMode = useSelector(selectDarkMode)
  return (
    <div className={`${darkMode ? "dark" : "light"}`}>
      {children}
    </div>
  )
}