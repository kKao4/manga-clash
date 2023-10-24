export default function AdminAddChapterButton({ setIsOpenAddChapter }: { setIsOpenAddChapter: any }) {
  return (
    <div className="relative col-span-1">
      <button
        className={`hover:bg-second-green border-second-green w-full flex flex-row items-center border-2 group rounded-md justify-center gap-x-2 min-h-[64px] transition-colors`}
        onClick={() => setIsOpenAddChapter((prevState: boolean) => !prevState)}
      >
        <svg className={`fill-second-green group-hover:fill-white h-5 transition-colors`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" /></svg>
        <span
          className={`text-second-green group-hover:text-white font-bold transition-colors`}
        >
          Thêm Chapter
        </span>
      </button>
    </div>
  )
}