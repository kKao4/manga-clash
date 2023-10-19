import { MangasResponse } from "@/type"
import OrderButton from "./order-button"
import Title from "./title"
import { useDispatch } from "react-redux"
import { Order, setSort } from "@/features/GlobalSlice"

export default function OrderNavigation({
  mangasLength,
  search,
  searchValue
}: {
  mangasLength: number,
  search: boolean,
  searchValue: MangasResponse["search"]
}) {
  const dispatch = useDispatch()
  const handleOnClick = (value: Order) => {
    dispatch(setSort(value))
  }
  return (
    <Title content={`${mangasLength} KẾT QUẢ ${search ? `CHO "${searchValue}"` : ""}`} order={true}>
      <div className="flex flex-row flex-wrap items-center">
        <p className="mb-0.5 mr-4 text-right">Sắp xếp</p>
        <OrderButton content="Mới Cập Nhật" search={search} handleOnClick={() => handleOnClick("latest")} />
        <OrderButton content="A-Z" search={search} handleOnClick={() => handleOnClick("a-z")} />
        <OrderButton content="Đánh Giá" search={search} handleOnClick={() => handleOnClick("rating")} />
        <OrderButton content="Lượt Xem" search={search} handleOnClick={() => handleOnClick("views")} />
        <OrderButton content="Mới Nhất" search={search} handleOnClick={() => handleOnClick("new")} />
      </div>
    </Title>
  )
}