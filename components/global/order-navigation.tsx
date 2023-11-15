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