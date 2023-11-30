export default function ToggleAdminModeButton({ adminMode, handleOnClick }: { adminMode: boolean, handleOnClick: any }) {
  return (
    <button
      className={`relative ${adminMode ? "bg-second-green" : "bg-gray-200"} w-[93px] sm:w-[82px] h-7 rounded-full text-xs gap-x-1 transition-all text-white text-start px-1.5 flex flex-row items-center`}
      onClick={handleOnClick}
    >
      <div className={`absolute w-5 h-5 rounded-full bg-white transition-all duration-300 ${adminMode ? "left-[53px]" : "left-1"}`}></div>
      <span className={`${adminMode ? "opacity-100" : "opacity-0"} absolute transition-opacity duration-200 font-bold left-2`}>Admin</span>
      <span className={`${!adminMode ? "opacity-100" : "opacity-0"} absolute transition-opacity duration-200 font-bold right-3.5`}>User</span>
    </button>
  )
}