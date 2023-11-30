import { useEventListener } from "usehooks-ts";

export function useKeyPressEscape(fnc: () => void) {
  useEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      fnc();
    }
  });
}
