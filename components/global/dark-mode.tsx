import { useSelector } from "react-redux"
import { selectDarkMode } from "@/features/GlobalSlice"
import { useEffect } from "react"
import Scrollbar from 'smooth-scrollbar';
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll';

export default function DarkMode({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    Scrollbar.use(OverscrollPlugin);
    Scrollbar.initAll({
      damping: 0.14,
      plugins: {
        overscroll: {
          effect: "bounce",
        },
      }
    })
  })
  const darkMode = useSelector(selectDarkMode)
  return (
    <div className={`${darkMode ? "dark" : "light"} overflow-auto max-h-screen`} data-scrollbar>
      {children}
    </div>
  )
}