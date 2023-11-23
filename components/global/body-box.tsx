import React from "react"

export default function BodyBox({ children }: { children: React.ReactNode }) {
  return (
    <main className="xl:max-w-[1150px] lg:max-w-[900px] mx-auto px-4 py-4 sm:py-6 xl:py-8">
      <div className="flex flex-col xl:flex-row gap-x-4 xl:gap-x-6">
        {children}
      </div>
    </main>
  )
}