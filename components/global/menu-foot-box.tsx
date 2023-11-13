import React from "react"

export default function MenuFootBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-search justify-items-center">
      <div className="xl:max-w-[1160px] lg:max-w-[900px] mx-auto px-4 sm:px-4">
        {children}
      </div>
    </div>
  )
}