import { useDarkMode, useIsClient } from 'usehooks-ts'

export default function DarkMode({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useDarkMode()
  const isClient = useIsClient()
  if (isClient) {
    return (
      <div className={`${isDarkMode ? "dark" : "light"}`}>
        {children}
      </div>
    )
  }
}