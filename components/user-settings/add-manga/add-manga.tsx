import Image from "next/image"
import { useState, useEffect } from "react"
import { MangaResponse, tagsArray } from "@/type"
import { HOST_URL } from "@/type"
import { PropagateLoader } from "react-spinners"

export default function AddManga() {
  const [mangaImage, setMangaImage] = useState<File>()
  const [name, setName] = useState<string>("")
  const [otherName, setOtherName] = useState<string>("")
  const [author, setAuthor] = useState<string>("")
  const [tags, setTags] = useState<string[]>([])
  const [description, setDescription] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  return (
    <>
      <div className="flex flex-col">
        <form className="flex flex-col py-2 gap-y-2" onSubmit={async (e) => {
          e.preventDefault()
          setIsLoading(true)
          const formData = new FormData(e.currentTarget)
          if (mangaImage) {
            formData.append("image", mangaImage)
          }
          const result = await fetch(`${HOST_URL}/api/admin/add_manga`, {
            method: "POST",
            body: formData
          })
          const res: MangaResponse = await result.json()
          if (res.message && res.data) {
            setName("")
            setOtherName("")
            setTags([])
            setDescription("")
            setAuthor("")
            setMangaImage(undefined)
            setIsLoading(false)
            window.open(`${HOST_URL}/manga/${res.data.href}`, "_blank")
          } else if (res.error) {
            alert(res.error)
            setIsLoading(false)
          }
        }}>
          <p className="font-bold">Ảnh bìa truyện</p>
          <div className="w-[140px] h-[190px] overflow-hidden flex place-items-center relative">
            <label className="absolute flex items-center justify-center w-full h-full transition-opacity duration-200 opacity-0 cursor-pointer bg-black/40 hover:opacity-100 peer">
              <input
                className="hidden"
                type="file"
                onChange={(e) => {
                  if (e.target.files) {
                    setMangaImage(e.target.files[0])
                  }
                }}
                required
              />
              <svg className="h-10 fill-gray-150" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM64 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm152 32c5.3 0 10.2 2.6 13.2 6.9l88 128c3.4 4.9 3.7 11.3 1 16.5s-8.2 8.6-14.2 8.6H216 176 128 80c-5.8 0-11.1-3.1-13.9-8.1s-2.8-11.2 .2-16.1l48-80c2.9-4.8 8.1-7.8 13.7-7.8s10.8 2.9 13.7 7.8l12.8 21.4 48.3-70.2c3-4.3 7.9-6.9 13.2-6.9z" /></svg>
            </label>
            {mangaImage ? (
              <Image className="w-full h-full" src={URL.createObjectURL(mangaImage)} alt="" width={320} height={460} quality={100} />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-neutral-200 peer-hover:hidden">
                <svg className="h-10 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" /></svg>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="name" className="font-bold">Tên truyện</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              className="w-full px-3 py-1.5 border border-neutral-400 rounded focus:outline-none"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="other-name" className="font-bold">Tên khác của truyện</label>
            <input
              type="text"
              id="other-name"
              name="otherName"
              value={otherName}
              className="w-full px-3 py-1.5 border border-neutral-400 rounded focus:outline-none"
              onChange={(e) => setOtherName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="author" className="font-bold">Tác giả</label>
            <input
              type="text"
              id="author"
              name="author"
              value={author}
              className="w-full px-3 py-1.5 border border-neutral-400 rounded focus:outline-none"
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="font-bold">Thể loại</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2">
              {tagsArray.map(tag => {
                return (
                  <div key={tag.id} className="flex flex-row col-span-1 gap-x-1">
                    <input
                      type="checkbox"
                      name="tags"
                      id={tag.id}
                      value={tag.title.toLowerCase()}
                      checked={tags.includes(tag.title)}
                      onChange={() => {
                        if (tags.includes(tag.title)) {
                          const newTags = tags.filter((t) => t !== tag.title)
                          setTags(newTags)
                        } else {
                          const newTags = [...tags, tag.title]
                          setTags(newTags)
                        }
                      }}
                    />
                    <label htmlFor={tag.id} className="select-none">{tag.title}</label>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-bold">Tóm tắt</label>
            <div>
              <div className="pt-1.5 pb-1 px-2 space-x-1 border border-b-transparent border-neutral-400 rounded-t">
                <button
                  type="button"
                  className="min-w-[28px] py-0.5 font-bold rounded-md hover:bg-neutral-200"
                  title="bold"
                  onClick={() => setDescription(prevDescription => prevDescription + "<b></b>")}
                >
                  B
                </button>
                <button
                  type="button"
                  className="min-w-[28px] py-0.5 font-serif italic font-bold rounded-md hover:bg-neutral-200"
                  title="italic"
                  onClick={() => setDescription(prevDescription => prevDescription + "<i></i>")}
                >
                  I
                </button>
                <button
                  type="button"
                  className="min-w-[28px] py-0.5 font-bold underline rounded-md hover:bg-neutral-200"
                  title="underline"
                  onClick={() => setDescription(prevDescription => prevDescription + "<u></u>")}
                >
                  U
                </button>
              </div>
              <textarea
                name="description"
                className={`w-full px-3 border border-neutral-400 border-t-transparent rounded-b focus:outline-none min-h-[240px] mt-0`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className={`w-full relative px-4 py-5 mx-auto font-bold text-white transition-colors rounded-full bg-second-green ${isLoading ? "" : "hover:bg-black"}`}
          >
            {isLoading ? (
              <div className="absolute top-1/3 left-1/2">
                <PropagateLoader color="#ffffff" size={12} />
              </div>
            ) : <p className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">Xác nhận tạo truyện</p>}
          </button>
        </form>
      </div>
    </>
  )
}