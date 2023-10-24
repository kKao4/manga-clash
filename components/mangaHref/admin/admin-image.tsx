import Image from "next/image"

export default function AdminImage({ setMangaUrl, setFile, mangaUrl }: { setMangaUrl: any, setFile: any, mangaUrl: string }) {
  return (
    <>
      <label
        className="absolute flex items-center justify-center w-full h-full transition-opacity duration-200 opacity-0 cursor-pointer bg-black/40 hover:opacity-100"
      >
        <input
          type="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              setMangaUrl(URL.createObjectURL(e.target.files[0]))
              if (e.target.files) {
                setFile(e.target.files[0])
              }
            }
          }}
        />
        <svg className="h-10 fill-gray-150" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM64 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm152 32c5.3 0 10.2 2.6 13.2 6.9l88 128c3.4 4.9 3.7 11.3 1 16.5s-8.2 8.6-14.2 8.6H216 176 128 80c-5.8 0-11.1-3.1-13.9-8.1s-2.8-11.2 .2-16.1l48-80c2.9-4.8 8.1-7.8 13.7-7.8s10.8 2.9 13.7 7.8l12.8 21.4 48.3-70.2c3-4.3 7.9-6.9 13.2-6.9z" /></svg>
      </label>
      <Image
        className="block w-full h-full mx-auto"
        src={mangaUrl}
        alt=""
        width="193"
        height="274"
        priority={true}
        quality={100}
      />
    </>
  )
}