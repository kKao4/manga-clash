export default function Radio({ content, checked, handleOnChange }: { content: string, checked: boolean, handleOnChange: () => void }) {
  return (
    <div className="flex flex-row items-center col-span-1 gap-x-1">
      <input
        type="radio"
        name="status"
        className="h-4"
        id={content.toLowerCase()}
        value={content}
        checked={checked}
        onChange={handleOnChange}
      />
      <label htmlFor={content.toLowerCase()} className="font-bold hover:text-second-green">{content}</label>
    </div>
  )
}