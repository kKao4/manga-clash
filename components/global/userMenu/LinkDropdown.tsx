import Link from "next/link"

export default function LinkDropdown({ content, href, handleOnClick, isLink = true }: { content: string, href?: string, handleOnClick: () => void, isLink?: boolean }) {
  if (isLink && href) {
    return (
      <Link
        href={href}
        className="w-full px-6 py-1.5 text-sm font-bold cursor-pointer text-start hover:text-second-green    dark:hover:text-third-green select-none"
        onClick={handleOnClick}
      >
        {content}
      </Link>
    )
  } else {
    return (
      <div
        className="w-full px-6 py-1.5 text-sm font-bold cursor-pointer text-start hover:text-second-green    dark:hover:text-third-green select-none"
        onClick={handleOnClick}
      >
        {content}
      </div>
    )
  }
}