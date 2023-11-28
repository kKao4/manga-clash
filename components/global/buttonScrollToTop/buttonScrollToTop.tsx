import { useDetectDirectionScrollY } from "@/hooks/useDetectDirectionScrollY";
import { useRouter } from "next/router";

export default function ButtonScrollToTop() {
  const router = useRouter()
  const directionScroll = useDetectDirectionScrollY()
  return (
    <button
      className={`fixed ${router.query.chapterNum ? "bottom-18" : "bottom-2"} right-2 bg-second-green h-8 w-8 md:w-10 md:h-10 rounded-full flex justify-center items-center shadow hover:bg-black transition-all ease-out z-40 ${directionScroll === "up" ? "scale-100" : "scale-0"}`}
      onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
    >
      <svg className="h-3 md:h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" /></svg>
    </button>
  )
}