import { DotLoader } from "react-spinners"

export default function DotLoaderComponent({
  size = 60, heightIsFull = false
}: {
  size?: number, heightIsFull?: boolean
}) {
  return (
    <div className={`flex justify-center items-center ${heightIsFull ? "h-full" : ""}`}>
      <DotLoader color="#409a88" size={size} />
    </div>
  )
}