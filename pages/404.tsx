import Image from "next/image";
import img from "@/assets/404.png"

export default function Custom404() {
  return (
    <>
      <div className="flex justify-center mt-10 mb-4">
        <Image src={img} alt="404 image" quality={0} />
      </div>
      <p className="font-bold text-2xl text-center">Oops! page not found.</p>
    </>
  )
}