import { useEffect, useRef } from "react"

export default function Slider() {
  const sliderRef = useRef<HTMLDivElement>(null)
  const nextContext = () => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = "translateX(-100%)"
    }
  }
  return (
    <>
      {/* <div className="w-[580px] h-[240px] border-green-500 border relative">
        <div ref={sliderRef} className="w-full h-full flex flex-row">
          <div className="w-full h-full bg-red-500 shrink-0" />
          <div className="w-full h-full bg-blue-500 shrink-0" />
        </div>
        <button className="absolute left-0 top-1/2 px-4 -translate-y-1/2">
          <svg className="h-6 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg>
        </button>
        <button className="absolute right-0 top-1/2 px-4 -translate-y-1/2" onClick={nextContext}>
          <svg className="h-6 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" /></svg>
        </button>
      </div> */}
    </>
  )
}