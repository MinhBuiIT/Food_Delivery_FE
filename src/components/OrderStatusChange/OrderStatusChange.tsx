import { InvalidateQueryFilters, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { changeStatusOrderApi } from 'src/apis/AdminRes/adminres.api'
import { OrderStatusNumEnum, OrderStatusTextEnum } from 'src/enums/OrderStatusEnum'
import { convertOrderStatusTextToNum } from 'src/utils/helper'

const OrderStatusChange = ({ id, status }: { id: number; status: OrderStatusTextEnum }) => {
  const queryClient = useQueryClient()
  const [statusSelect, setStatusSelect] = useState<OrderStatusNumEnum>(convertOrderStatusTextToNum(status))

  const changeStatusOrderMutation = useMutation({
    mutationFn: (status: OrderStatusNumEnum) => changeStatusOrderApi(id, status)
  })

  const handleChangeStatusOrder = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const toastId = toast.loading('Đang xử lý...')
    setStatusSelect(Number(e.target.value) as OrderStatusNumEnum)
    changeStatusOrderMutation.mutate(Number(e.target.value), {
      onSuccess: () => {
        queryClient.invalidateQueries(['order'] as InvalidateQueryFilters)
        toast.success('Thay đổi trạng thái đơn hàng thành công', { id: toastId })
      },
      onError: () => {
        toast.error('Thay đổi trạng thái đơn hàng thất bại', { id: toastId })
      }
    })
  }

  return (
    <form className='max-w-full'>
      <select
        id='status'
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
        value={statusSelect}
        onChange={handleChangeStatusOrder}
      >
        <option value={OrderStatusNumEnum.PENDING}>{OrderStatusTextEnum.PENDING}</option>
        <option value={OrderStatusNumEnum.CONFIRMED}>{OrderStatusTextEnum.CONFIRMED}</option>
        <option value={OrderStatusNumEnum.SHIPPING}>{OrderStatusTextEnum.SHIPPING}</option>
        <option value={OrderStatusNumEnum.DELIVERED}>{OrderStatusTextEnum.DELIVERED}</option>
        <option value={OrderStatusNumEnum.CANCELLED}>{OrderStatusTextEnum.CANCELLED}</option>
      </select>
    </form>
  )
}

export default OrderStatusChange
