import { setReadingStyle } from "@/features/GlobalSlice";
import { RootState } from "@/store";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

export function useReadingStyle() {
  const readingStyle = useSelector((state: RootState) => state.global.readingStyle)
  const dispatch = useDispatch()

  const toggleReadingStyle = (value: typeof readingStyle) => {
    dispatch(setReadingStyle(value))
    localStorage.setItem("readingStyle", JSON.stringify(value))
  }

  // set quick menu mode theo localStorage
  useEffect(() => {
    const readingStyleLocalStorage = localStorage.getItem("readingStyle")
    if (readingStyleLocalStorage) {
      dispatch(setReadingStyle(JSON.parse(readingStyleLocalStorage)))
    }
  }, [dispatch])

  return { readingStyle, toggleReadingStyle }
}