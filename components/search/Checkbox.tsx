import { useDispatch, useSelector } from "react-redux"
import { addOrDeleteSearchTags, selectSearchState } from "@/features/search/SearchSlice"

export default function Checkbox({ content }: { content: string }) {
  const dispatch = useDispatch()
  const searchState = useSelector(selectSearchState)
  return (
    <div className="flex flex-row items-center col-span-1 gap-x-1">
      <input
        type="checkbox"
        name="tags"
        className="h-4"
        id={content.toLowerCase()}
        checked={searchState.tags.includes(content.toLowerCase())}
        value={content}
        onChange={() => dispatch(addOrDeleteSearchTags(content.toLowerCase()))} />
      <label htmlFor={content.toLowerCase()} className="font-bold select-none hover:text-second-green">{content}</label>
    </div>
  )
}