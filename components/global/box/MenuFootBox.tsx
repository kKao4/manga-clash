import React from "react"

export default function MenuFootBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-search dark:bg-[rgb(24,24,24)] dark:bg-none justify-items-center">
      <div className="xl:max-w-[1150px] lg:max-w-[900px] mx-auto px-4 sm:px-4">
        {children}
      </div>
    </div>
  )
}