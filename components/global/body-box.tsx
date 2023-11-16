import React from "react"

export default function BodyBox({ children }: { children: React.ReactNode }) {
  return (
    <main className="xl:max-w-[1150px] lg:max-w-[900px] mx-auto px-4 py-5 sm:py-10">
      <div className="flex flex-col xl:flex-row gap-x-4 xl:gap-x-8">
        {children}
      </div>
    </main>
  )
}