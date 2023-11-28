import { initialMangaState } from "@/features/mangaHref/MangaSlice"
import { MangaType } from "@/models/manga"
import { SignatureResponse } from "@/type"
import { useEffect, useRef, useState } from "react"
import { PacmanLoader } from "react-spinners"

export default function AdminAddChapterModal({
  isOpenAddChapter, mangaState, chapters, chaptersOrder, setChapters
}: {
  isOpenAddChapter: boolean, mangaState: typeof initialMangaState[number], chapters: MangaType["chapters"], chaptersOrder: "earliest" | "latest", setChapters: any
}) {
  const [num, setNum] = useState<string>("")
  const [chapterDescription, setChapterDescription] = useState<string>("")
  const [validChapterMessage, setValidChapterMessage] = useState<string>("")
  const [isAddingChapter, setIsAddingChapter] = useState<boolean>(false)
  const cloudinaryRef = useRef<any>();
  const widgetRef = useRef<any>();
  const [signatureRes, setSignatureRes] = useState<SignatureResponse["data"]>();
  const [arrayImages, setArrayImages] = useState<{ name: string, url: string, publicId: string }[]>([]);
  const [uploadedImages, setUploadImages] = useState<boolean>(false)
  // set valid num message
  useEffect(() => {
    if (!num || Number(num) < 0) {
      setValidChapterMessage("Không hợp lệ")
    } else if (chapters?.find((c) => c.num === num)) {
      setValidChapterMessage("Chapter đã tồn tại")
    } else {
      setValidChapterMessage("")
    }
  }, [num, chapters])
  // set biggest number chapter is default value
  useEffect(() => {
    if (chapters && chapters.length) {
      if (chaptersOrder === "latest") {
        setNum((Number(chapters[0].num) + 1).toString())
      } else {
        setNum((Number(chapters[chapters.length - 1].num) + 1).toString())
      }
    } else {
      setNum("")
    }
  }, [chapters, chaptersOrder])
  // take api key for signed upload
  useEffect(() => {
    if (num) {
      const fetchSignature = async () => {
        const result = await fetch(
          `/api/admin/sign_up_load_widget?id=${mangaState._id}&num=${num}`
        );
        const res = await result.json();
        setSignatureRes(res.data);
      };
      fetchSignature();
    }
  }, [mangaState, num]);
  // uploading images
  useEffect(() => {
    cloudinaryRef.current = (window as any).cloudinary;
    if (cloudinaryRef.current && signatureRes) {
      widgetRef.current = cloudinaryRef.current.createUploadWidget(
        {
          cloudName: "dnjlnj9dy",
          folder: `mangas/${mangaState._id}/chapter-${num}`,
          apiKey: signatureRes.apiKey,
          uploadSignatureTimestamp: signatureRes.timestamp,
          uploadSignature: signatureRes.signature,
        },
        (error: any, result: any) => {
          // console.log(
          //   "🚀 ~ file: upload-widget.jsx:12 ~ useEffect ~ result:",
          //   result
          // );
          if (result.event === "success") {
            setArrayImages((prevArrayChapter) => [
              ...prevArrayChapter,
              {
                name: result.info.original_filename,
                url: result.info.url,
                publicId: result.info.public_id,
              },
            ]);
            console.log(arrayImages)
          } else if (result.event === "queues-start") {
            setIsAddingChapter(true);
          } else if (result.event === "queues-end") {
            setUploadImages(true)
          } else if (result.event === "abort") {
            setIsAddingChapter(false)
          }
        }
      );
    }
  }, [
    mangaState,
    num,
    setArrayImages,
    signatureRes,
    arrayImages,
    setIsAddingChapter,
  ]);
  // post create chapter
  useEffect(() => {
    if (uploadedImages) {
      const addChapter = async () => {
        const formData = new FormData();
        formData.append("num", num);
        formData.append("description", chapterDescription);
        arrayImages.forEach((image) => {
          formData.append("arrayImages", JSON.stringify(image));
        });
        const result = await fetch(
          `/api/admin/add_and_update_chapter?href=${mangaState.href}`,
          {
            method: "POST",
            body: formData,
          }
        );
        const res = await result.json();
        // console.log("🚀 ~ file: chapters.tsx:90 ~ onSubmit={ ~ res:", res)
        if (res.message) {
          setNum("")
          setChapterDescription("")
          const mangaResult = await fetch(`/api/manga/${mangaState.href}`)
          const mangaRes = await mangaResult.json()
          setChapters(mangaRes.data.chapters)
        } else if (res.error) {
          alert(res.error)
        }
        setIsAddingChapter(false)
      };
      addChapter();
      setUploadImages(false)
      setArrayImages([])
    }
  }, [arrayImages, , chapterDescription, mangaState, num, setChapters, uploadedImages])

  return (
    <div
      className={`${isOpenAddChapter ? "scale-100 -translate-y-full opacity-100" : "opacity-0 scale-0 -translate-y-1/2 -translate-x-1/2"} grid grid-cols-4 gap-x-2 px-3 absolute transition-all duration-200 w-full sm:w-[300px] h-[110px] rounded-md shadow border-2 border-second-green bg-white dark:bg-neutral-750 z-10 content-evenly top-2`}
    >
      <div className="col-span-1 space-y-1">
        <input
          type="number"
          min={0}
          max={9999}
          value={num}
          className={`${validChapterMessage ? "border-b-red-500 text-red-500" : "border-b-gray-200"} w-full text-center py-1 border-b dark:bg-neutral-750 focus:outline-none`}
          onChange={(e) => {
            if (!isAddingChapter) {
              setNum(e.target.value)
            }
          }}
        />
      </div>
      <input
        type="text"
        className="col-span-3 py-1 border-b border-gray-200 dark:bg-neutral-750  focus:outline-none h-fit"
        placeholder="Chú thích (nếu có)"
        value={chapterDescription}
        onChange={(e) => {
          if (!isAddingChapter) {
            setChapterDescription(e.target.value)
          }
        }}
      />
      <p className="col-span-full text-2sm text-red-500">{validChapterMessage}</p>
      <div className="col-span-full">
        <div
          className={`${!validChapterMessage ? "bg-second-green" : "bg-red-500"
            } text-white rounded-md font-medium w-full min-h-[34px] cursor-pointer grid place-content-center`}
          onClick={() => {
            if (validChapterMessage === "" && !isAddingChapter) {
              if (widgetRef.current) {
                widgetRef.current.open();
              }
            }
          }}
        >
          {isAddingChapter ? (
            <PacmanLoader color="#ffffff" size={12} />
          ) : <p>Chọn ảnh</p>}
        </div>
      </div>
    </div>
  )
}