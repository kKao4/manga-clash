import React from "react"

export default function BodyBox({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <main className={`xl:max-w-[1150px] lg:max-w-[900px] mx-auto px-4 py-4 md:py-6 ${className}`}>
      <div className="flex flex-col xl:flex-row gap-x-4 xl:gap-x-6">
        {children}
      </div>
    </main>
  )
}