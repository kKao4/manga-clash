import { useState, RefObject } from "react";
import { useEventListener } from "usehooks-ts";

export const usePercentScrollYOfElement = (ref: RefObject<any>) => {
  const [percentScrollY, setPercentScrollY] = useState<number>(0);
  useEventListener("scroll", () => {
    const currentScrollY = window.scrollY || document.documentElement.scrollTop;
    if (ref.current) {
      setPercentScrollY(
        Math.min(
          Math.max(
            Math.round(
              ((currentScrollY - ref.current.offsetTop) * 100) /
                (ref.current.scrollHeight - ref.current.offsetTop)
            ),
            0
          ),
          100
        )
      );
    }
  });
  return percentScrollY;
};
