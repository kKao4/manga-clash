import React, { useId } from "react"

export default function Input({
  content, value, type, handleOnChange, valid, validContent, children, name
}: {
  content: string, value: string, type: "text" | "password", name: string, handleOnChange: (arg: string) => void, valid: boolean, validContent: string, children?: React.ReactNode
}) {
  const uniqueId = useId()
  return (
    <div className="flex flex-col gap-y-2">
      <div className="space-x-1">
        <label htmlFor={uniqueId} className="inline-block font-bold">{content}</label>
        <span className="inline-block font-bold">*</span>
      </div>
      <input
        type={type}
        id={uniqueId}
        name={name}
        className={`${!valid ? "border-red-500 border" : ""} px-4 py-3 w-full focus:outline-none dark:bg-neutral-700 rounded ${content === "Password" ? "tracking-[2px]" : "tracking-wide"}`}
        value={value}
        onChange={(e) => handleOnChange(e.target.value)}
        required
        autoComplete="on"
      />
      <p className={`${valid ? "hidden" : "block"} text-red-500 text-sm`}>{validContent}</p>
      {children}
    </div>
  )
}