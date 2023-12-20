import { setDarkMode } from "@/features/GlobalSlice";
import { RootState } from "@/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useDarkMode() {
  const isDarkMode = useSelector((state: RootState) => state.global.darkMode)
  const dispatch = useDispatch()

  // toggle darkmode
  const toggleDarkMode = () => {
    dispatch(setDarkMode())
    const isDarKModeLocalStorage = localStorage.getItem("darkMode")
    if (isDarKModeLocalStorage) {
      localStorage.setItem("darkMode", JSON.stringify(!JSON.parse(isDarKModeLocalStorage)))
    } else {
      localStorage.setItem("darkMode", JSON.stringify(!isDarkMode))
    }
  }

  // update darkmode dựa theo localStorage
  useEffect(() => {
    const isDarKModeLocalStorage = localStorage.getItem("darkMode")
    if (isDarKModeLocalStorage) {
      dispatch(setDarkMode(JSON.parse(isDarKModeLocalStorage)))
    }
  }, [dispatch])

  return { isDarkMode, toggleDarkMode }
}