import { motion } from "framer-motion";

export default function ToggleAdminModeButton({ adminMode, handleOnClick }: { adminMode: boolean, handleOnClick: () => void }) {
  return (
    <div className={`w-[76px] h-7 ${adminMode ? "bg-second-green" : "bg-gray-200"} rounded-full flex flex-row  shrink-0 ${adminMode ? "justify-end" : "justify-start"} cursor-pointer transition-all duration-200 px-[3px] relative`} onClick={handleOnClick}>
      <motion.div
        layout
        transition={{ bounce: 0.45, type: "spring", duration: 0.5 }}
        className="w-[22px] h-[22px] rounded-full bg-white my-[3.5px]"
      />
      <span className={`${adminMode ? "opacity-100" : "opacity-0"} absolute text-xs top-1/2 -translate-y-1/2 text-white transition-opacity select-none duration-200 font-bold left-2`}>Admin</span>
      <span className={`${!adminMode ? "opacity-100" : "opacity-0"} absolute text-xs top-1/2 -translate-y-1/2 text-white transition-opacity select-none duration-200 font-bold right-3.5`}>User</span>
    </div>
  )
}