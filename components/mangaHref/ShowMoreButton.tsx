export default function ShowMore({ handleOnClick, showMore }: { handleOnClick: () => void, showMore: boolean }) {
  return (
    <div className="w-full">
      <button
        className="block py-2 mx-auto font-bold"
        onClick={handleOnClick}
      >
        <div className="flex flex-row items-center gap-x-1">
          {showMore ? "Ẩn bớt" : "Xem thêm"}
          <svg className={`h-3.5 ${showMore ? "rotate-180" : "rotate-0"} dark:fill-neutral-100`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" /></svg>
        </div>
      </button>
    </div>
  )
}