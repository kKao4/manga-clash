export default function Row({
  header, children, handleOnSubmit, valid, isLoading
}: {
  header: string, children: React.ReactNode, handleOnSubmit: (e: React.FormEvent<HTMLFormElement>) => void, valid: boolean, isLoading: boolean
}) {
  return (
    <form className="py-2 pb-4 border-b" onSubmit={(e) => handleOnSubmit(e)}>
      <p className="font-bold">{header}</p>
      <div className="py-4 space-y-5">
        {children}
      </div>
      <div>
        <button
          type="submit"
          className={`${valid ? "bg-second-green" : "bg-red-500"} ${isLoading ? "" : "hover:bg-black"} rounded-2xl mx-auto block transition-colors text-white font-bold px-4 py-2 text-sm`}
          disabled={!valid || isLoading}
        >
          {isLoading ? (
            <div className="flex flex-row items-center gap-x-2">
              <span>Đang xử lý</span>
              <svg className="h-4 fill-white animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" /></svg>
            </div>
          ) : "Thay Đổi"}
        </button>
      </div>
    </form>
  )
}