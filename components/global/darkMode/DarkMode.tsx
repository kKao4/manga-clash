import { useDarkMode } from '@/hooks/useDarkMode';
import { useEffect } from 'react'

export default function DarkMode({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useDarkMode()

  // tạo kiểu cho scroll bar của html sáng/tối
  useEffect(() => {
    const scrollbarStyles = isDarkMode ? `::-webkit-scrollbar {
        width: 8px;
      }
      ::-webkit-scrollbar-track {
        background-color: rgb(38, 38, 38);
      }
      ::-webkit-scrollbar-thumb {
        background-color: rgb(82, 82, 82);
        border-radius: 9999px;
        transition: background-color 0.15s ease;
      }
      ::-webkit-scrollbar-thumb:hover {
        background-color: rgb(52, 142, 124);
      }
      ` : `::-webkit-scrollbar {
        width: 8px;
      }
      ::-webkit-scrollbar-track {
        background-color: rgb(230,230,230);
      }
      ::-webkit-scrollbar-thumb {
        background-color: rgb(115,115,115);
        border-radius: 9999px;
        transition: background-color 0.15s ease;
      }
      ::-webkit-scrollbar-thumb:hover {
        background-color: rgb(52, 142, 124);
      }`
    const styleSheet = document.createElement('style');
    styleSheet.innerText = scrollbarStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [isDarkMode])

  return (
    <div className={`${isDarkMode ? "dark" : "light"}`} data-darkmode={isDarkMode} role='theme-container'>
      {children}
    </div>
  )
}