import { MangasResponse } from "@/type";
import Slider from "react-slick";
import PageSlick from "./PageSlick";

export default function Slick({ mangas }: { mangas: MangasResponse["data"] }) {
  return (
    <>
      <Slider
        className="w-screen md:w-[572px] lg:w-[580px] h-[250px]"
        dots={true}
        infinite={true}
        speed={400}
        slidesToShow={1}
        slidesToScroll={1}
        arrows={false}
        autoplay={true}
        autoplaySpeed={4000}
        easing="ease-out"
        lazyLoad="progressive"
        pauseOnDotsHover={true}
        pauseOnHover={true}
        appendDots={(dots) => {
          return (
            <div style={{
              position: "absolute",
              bottom: "0px",
            }}>
              {dots}
            </div>
          )
        }}
        customPaging={
          (i) => {
            return <div style={{
              width: "0.75rem",
              height: "0.75rem",
              backgroundColor: "#61646c",
              borderRadius: "9999px",
            }} />
          }
        }
      >
        {mangas?.map(manga => {
          return <PageSlick key={manga.name + "-slick"} manga={manga} />
        })}
      </Slider>
    </>
  )
}