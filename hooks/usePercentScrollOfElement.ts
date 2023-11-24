import { useState, RefObject } from "react";
import { useEventListener } from "usehooks-ts";

export const usePercentScrollYOfElement = (ref: RefObject<any>) => {
  const [percentScrollY, setPercentScrollY] = useState<number>(0);
  // console.log("🚀 ~ file: usePercentScrollOfElement.ts:6 ~ usePercentScrollYOfElement ~ percentScrollY:", percentScrollY)
  useEventListener("scroll", () => {
    const currentScrollY = window.scrollY || document.documentElement.scrollTop;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    if (ref.current) {
      setPercentScrollY(
        Math.min(
          Math.max(
            ((currentScrollY - ref.current.offsetTop) * 100) /
              (ref.current.scrollHeight - viewportHeight),
            0
          ),
          100
        )
      );
    }
  });
  return percentScrollY;
};
