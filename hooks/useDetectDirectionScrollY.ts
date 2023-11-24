import { useEffect, useState } from "react";

export const useDetectDirectionScrollY = () => {
  const [directionScrollY, setDirectionScrollY] = useState<"up" | "down">(
    "down"
  );
  useEffect(() => {
    let lastScrollTop = window.scrollY || document.documentElement.scrollTop;
    const index = () => {
      const scrollTopPosition =
        window.scrollY || document.documentElement.scrollTop;
      if (scrollTopPosition < lastScrollTop) {
        setDirectionScrollY("up");
      } else if (scrollTopPosition > lastScrollTop) {
        setDirectionScrollY("down");
      }
      lastScrollTop = scrollTopPosition <= 0 ? 0 : scrollTopPosition;
    };
    window.addEventListener("scroll", index);
    return () => window.removeEventListener("scroll", index);
  }, [directionScrollY]);
  return directionScrollY;
};
