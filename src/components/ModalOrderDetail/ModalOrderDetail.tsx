import { Divider, Modal } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getOrderDetailApi } from 'src/apis/order.api'
import { OrderStatusTextEnum } from 'src/enums/OrderStatusEnum'
import { PaymentEnum } from 'src/enums/PaymentEnum'
import { OrderType } from 'src/types/OrderType'
import { convertPaymentMethodTextToNum, formatPrice, handleTime } from 'src/utils/helper'

interface ModalOrderDetailProps {
  open: boolean
  handleClose: (open: boolean) => void
  orderDetailId: number | null
  orderDetail?: (OrderType & { customer: { id: number; fullName: string; email: string } }) | null
}

const ModalOrderDetail = ({ open, handleClose, orderDetailId, orderDetail }: ModalOrderDetailProps) => {
  const orderDetailQuery = useQuery({
    queryKey: ['orderDetail', orderDetailId],
    queryFn: () => getOrderDetailApi(Number(orderDetailId)),
    enabled: !!orderDetailId,
    staleTime: 1000 * 60 * 2 // 2 minutes
  })
  const orderDetailData = orderDetail ? orderDetail : orderDetailQuery.data?.data.metadata

  return (
    <Modal
      open={open}
      onClose={() => handleClose(false)}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      className='flex items-center justify-center'
    >
      <>
        {orderDetailData && (
          <div className='w-[500px] min-h-[150px] p-5 bg-white rounded'>
            <div className='flex items-start justify-between text-[18px] mb-2'>
              <span className='font-semibold w-[50%] flex-shrink'>Nhà hàng</span>
              <span className='font-normal text-end'>{orderDetailData.restaurant}</span>
            </div>
            <div className='flex items-start justify-between text-[18px] mb-2'>
              <span className='font-semibold w-[50%] flex-shrink'>Địa chỉ</span>
              <span className='font-normal text-end'>
                {orderDetailData.address.numberStreet +
                  ', ' +
                  orderDetailData.address.street +
                  ', ' +
                  orderDetailData.address.ward +
                  ', ' +
                  orderDetailData.address.district +
                  ', ' +
                  orderDetailData.address.city}
              </span>
            </div>
            {orderDetail && (
              <>
                <div className='flex items-start justify-between text-[18px] mb-2'>
                  <span className='font-semibold w-[50%] flex-shrink'>Người đặt</span>
                  <span className='font-normal text-end'>{orderDetail.customer.fullName}</span>
                </div>
                <div className='flex items-start justify-between text-[18px] mb-2'>
                  <span className='font-semibold w-[50%] flex-shrink'>Email người đặt</span>
                  <span className='font-normal text-end'>{orderDetail.customer.email}</span>
                </div>
              </>
            )}
            <div className='flex items-start justify-between text-[18px] mb-2'>
              <span className='font-semibold w-[50%] flex-shrink'>Số điện thoại giao hàng</span>
              <span className='font-normal text-end'>{orderDetailData.address.phone}</span>
            </div>
            <div className='flex items-start justify-between text-[18px] mb-2'>
              <span className='font-semibold w-[50%] flex-shrink'>Số món ăn</span>
              <span className='font-normal text-end'>{orderDetailData.totalItem}</span>
            </div>
            <div className='flex items-start justify-between text-[18px] mb-2'>
              <span className='font-semibold w-[50%] flex-shrink'>Tổng tiền</span>
              <span className='font-normal text-end'>{formatPrice(orderDetailData.totalPrice)}đ</span>
            </div>
            <div className='flex items-start justify-between text-[18px] mb-2'>
              <span className='font-semibold w-[50%] flex-shrink'>Trạng thái</span>
              {orderDetailData.orderStatus !== OrderStatusTextEnum.CANCELLED ? (
                <span className='bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded  border border-blue-400'>
                  {orderDetailData.orderStatus}
                </span>
              ) : (
                <span className='bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded  border border-red-400'>
                  {orderDetailData.orderStatus}
                </span>
              )}
            </div>
            <div className='flex items-start justify-between text-[18px] mb-2'>
              <span className='font-semibold w-[50%] flex-shrink'>Thời gian đặt</span>
              <span className='font-normal text-end'>{handleTime(orderDetailData.createdAt)}</span>
            </div>
            <div className='flex items-start justify-between text-[18px] mb-2'>
              <span className='font-semibold w-[50%] flex-shrink'>Phương thức thanh toán</span>
              <span className='font-normal text-end'>
                {convertPaymentMethodTextToNum(orderDetailData.payment) === PaymentEnum.BANK
                  ? 'Chuyển khoản'
                  : 'Thanh toán khi nhận món ăn'}
              </span>
            </div>
            <Divider />
            <h4 className='py-3 text-center text-[18px] font-semibold text-gray-600'>Chi tiết món ăn</h4>
            <div>
              <ul className='text-[18px]'>
                {orderDetailData.orderItems.map((orderItem) => {
                  return (
                    <li className='flex items-start justify-between mb-3' key={orderItem.id}>
                      <div>
                        <span className='font-semibold'>{orderItem.food.name}</span>
                        <span className='text-gray-500 ms-1'>x{orderItem.quantity}</span>
                        <div className='ms-3 text-gray-500 text-[16px]'>
                          {orderItem.ingredients.length > 0 &&
                            orderItem.ingredients.map((ing) => {
                              return <div key={ing.id}>- {ing.name}</div>
                            })}
                          <div>{orderItem.specialInstructions}</div>
                        </div>
                      </div>
                      <div>
                        <span className='font-normal'>{formatPrice(orderItem.totalPrice)}đ</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        )}
      </>
    </Modal>
  )
}

export default ModalOrderDetail
