import { useEffect, useState } from "react";

export function useDetectDirectionScroll() {
  const [directionScroll, setDirectionScroll] = useState<"up" | "down">();
  const [prevScrollPosition, setPrevScrollPosition] = useState<number>(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = document.documentElement.scrollTop;
      setDirectionScroll(scrollPosition > prevScrollPosition ? "down" : "up");
      setPrevScrollPosition(scrollPosition);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPosition]);
  return directionScroll;
}

