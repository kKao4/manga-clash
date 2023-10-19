export default function Input({ children, label }: { children: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col flex-wrap items-center sm:flex-row gap-y-2">
      <div className="w-full text-sm font-bold text-gray-200 basis-1/3">{label}</div>
      {children}
    </div>
  )
}