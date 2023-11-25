import OrderButton from "./order-button"
import Title from "./title"
import { useDispatch, useSelector } from "react-redux"
import { Order, setSort } from "@/features/GlobalSlice"
import { selectSearchState } from "@/features/search/SearchSlice"
import { useRouter } from "next/router"

export default function OrderNavigation({
  mangasLength,
  search,
}: {
  mangasLength: number | undefined,
  search: boolean,
}) {
  const dispatch = useDispatch()
  const handleOnClick = (value: Order) => {
    dispatch(setSort(value))
  }
  const router = useRouter()
  return (
    <Title content={`${mangasLength} KẾT QUẢ ${search ? `CHO "${router.query.name ?? ""}"` : ""}`} order={true}>
      <div className="flex flex-row flex-wrap items-center mr-auto">
        <p className="mb-0.5 mr-4 ml-8 text-right md:block hidden">Sắp xếp</p>
        <OrderButton content="Mới cập nhật" search={search} handleOnClick={() => handleOnClick("latest")} />
        <OrderButton content="A-Z" search={search} handleOnClick={() => handleOnClick("a-z")} />
        <OrderButton content="Đánh giá" search={search} handleOnClick={() => handleOnClick("rating")} />
        <OrderButton content="Lượt xem" search={search} handleOnClick={() => handleOnClick("views")} />
        <OrderButton content="Mới" search={search} handleOnClick={() => handleOnClick("new")} />
      </div>
    </Title>
  )
}