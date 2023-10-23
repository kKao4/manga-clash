import { useEffect, useRef, useState } from "react";

export default function UploadWidget({ num, mangaState, setArrayChapter }) {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const [signatureRes, setSignatureRes] = useState();
  useEffect(() => {
    const fetchSignature = async () => {
      // TODO: only admin need to fetch this data
      const result = await fetch(
        `/api/admin/sign_up_load_widget?id=${mangaState._id}&num=${num}`
      );
      const res = await result.json();
      setSignatureRes(res.data);
    };
    fetchSignature();
  }, [mangaState, num]);
  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    if (cloudinaryRef.current && signatureRes) {
      widgetRef.current = cloudinaryRef.current.createUploadWidget(
        {
          cloudName: "dnjlnj9dy",
          folder: `mangas/${mangaState._id}/chapter-${num}`,
          apiKey: signatureRes.apiKey,
          uploadSignatureTimestamp: signatureRes.timestamp,
          uploadSignature: signatureRes.signature,
        },
        (error, result) => {
          console.log(
            "🚀 ~ file: upload-widget.jsx:12 ~ useEffect ~ result:",
            result
          );
          if (!error && result && result.event === "success") {
            setArrayChapter((prevArrayChapter) => [
              ...prevArrayChapter,
              {
                name: result.info.original_filename,
                url: result.info.url,
                publicId: result.info.public_id,
              },
            ]);
          }
        }
      );
    }
  }, [mangaState, num, setArrayChapter, signatureRes]);
  return <button onClick={() => widgetRef.current.open()}>Click me</button>;
}
