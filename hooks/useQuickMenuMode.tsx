import { setQuickMenuMode } from "@/features/GlobalSlice";
import { RootState } from "@/store";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

export function useQuickMenuMode() {
  const quickMenuMode = useSelector((state: RootState) => state.global.quickMenuMode)
  const dispatch = useDispatch()

  const toggleQuickMenuMode = () => {
    dispatch(setQuickMenuMode())
    localStorage.setItem("quickMenuMode", JSON.stringify(!quickMenuMode))
  }

  // set quick menu mode theo localStorage
  useEffect(() => {
    const quickMenuModeLocalStorage = localStorage.getItem("quickMenuMode")
    if (quickMenuModeLocalStorage) {
      dispatch(setQuickMenuMode(JSON.parse(quickMenuModeLocalStorage)))
    }
  }, [dispatch])

  return { quickMenuMode, toggleQuickMenuMode }
}