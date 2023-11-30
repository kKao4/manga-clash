import { useEventListener } from "usehooks-ts";

export function useKeyPressEscapeModal(fnc: () => void) {
  useEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      fnc();
    }
  });
}
