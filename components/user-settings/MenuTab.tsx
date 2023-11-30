export default function MenuTab({
  children, isActive, handleOnClick
}: {
  children: React.ReactNode, isActive: boolean, handleOnClick: () => void
}) {
  return (
    <>
      <div className="flex flex-row items-center transition-colors" onClick={handleOnClick}>
        <button className={`${isActive ? "bg-second-green text-white" : "bg-gray-150 dark:bg-neutral-750 hover:text-second-green dark:hover:text-main-green"} flex flex-row items-center px-4 py-3.5 font-bold basis-full gap-x-3 group`}>
          {children}
        </button>
        <div className={`${isActive ? "visible" : "invisible"} hidden sm:inline-block w-0 h-0 border-[9px] border-transparent border-l-second-green mr-3`}></div>
      </div >
    </>
  )
}