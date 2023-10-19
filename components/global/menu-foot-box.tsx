import React from "react"

export default function MenuFootBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-[url(../assets/bg-search.jpg)] justify-items-center">
      <div className="xl:max-w-[1160px] lg:max-w-[900px] mx-auto px-2 sm:px-4">
        {children}
      </div>
    </div>
  )
}