export default function Select({ value, handleOnChange, children, width, contentCenter = false }: { value: string, handleOnChange: any, children: React.ReactNode, width: string, contentCenter?: boolean }) {
  return (
    <div className={`relative overflow-hidden ${width}`}>
      <select
        value={value}
        className={`bg-[rgb(77,77,77)] hover:bg-neutral-600 px-3 py-2 w-full focus:outline-none peer transition-colors rounded-md text-neutral-100 ${contentCenter ? "text-center" : "text-start"}`} id="select-chapter"
        onChange={(e) => handleOnChange(e)}
      >
        {children}
      </select>
      <span className="absolute top-0 right-0 w-6 h-[94%] transition-colors rounded-md bg-[rgb(77,77,77)] peer-hover:bg-neutral-600">
        <svg className="block w-2 h-full mx-auto fill-neutral-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z" /></svg>
      </span>
    </div>
  )
}