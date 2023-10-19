export default function Input({ content, value, handleOnChange }: { content: string, value: string, handleOnChange: (arr: string) => void }) {
  return (
    <div className="flex flex-col items-center w-full py-3 sm:flex-row sm:w-5/6 lg:w-2/3 gap-y-1">
      <p className="w-full font-bold basis-1/3">{content}</p>
      <input
        type="text"
        name={content.toLowerCase()} className="px-3 py-1.5 focus:outline-none rounded w-full"
        placeholder={content}
        value={value}
        onChange={(e) => handleOnChange(e.target.value)}
      />
    </div>
  )
}