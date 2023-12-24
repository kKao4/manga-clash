import { useDarkMode } from '@/hooks/useDarkMode';
import { ToastContainer, cssTransition } from 'react-toastify';
import { useWindowSize } from 'usehooks-ts';

export default function Toastify() {
  const { isDarkMode } = useDarkMode()
  const { width } = useWindowSize()
  const Slide = cssTransition({
    enter: width >= 768 ? "slideInBottom" : "scaleUp",
    exit: "scaleDown"
  })
  return (
    <ToastContainer
      position={width >= 768 ? "bottom-right" : "top-center"}
      autoClose={4000}
      limit={4}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={true}
      draggable={true}
      draggablePercent={40}
      pauseOnHover={true}
      theme={isDarkMode ? "dark" : "light"}
      transition={Slide}
    />
  )
}