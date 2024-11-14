import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { cancelOrderApi, getOrdersApi } from 'src/apis/order.api'
import ModalOrderDetail from 'src/components/ModalOrderDetail'
import { OrderStatusNumEnum, OrderStatusTextEnum } from 'src/enums/OrderStatusEnum'
import { formatPrice, handleTime, isBadRequestError, isNotFoundError } from 'src/utils/helper'

const MyOrders = () => {
  const [openOrderDetailModal, setOpenOrderDetailModal] = useState(false)
  const [orderDetailId, setOrderDetailId] = useState<number | null>(null)
  const [orderStatus, setOrderStatus] = useState<OrderStatusNumEnum>(OrderStatusNumEnum.ALL)

  //API
  const myOrdersQuery = useQuery({
    queryKey: ['myOrders', orderStatus],
    queryFn: () => getOrdersApi(orderStatus),
    refetchOnWindowFocus: true
  })
  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: number) => cancelOrderApi(orderId)
  })

  //END API
  const toggleOrderDetailModal = (open: boolean) => {
    setOpenOrderDetailModal(open)
  }

  const myOrdersData = myOrdersQuery.data?.data.metadata || []

  const handleClickOrderDetail = (orderId: number) => {
    setOrderDetailId(orderId)
    toggleOrderDetailModal(true)
  }
  const handleCancelOrder = (orderId: number) => {
    cancelOrderMutation.mutate(orderId, {
      onSuccess: () => {
        myOrdersQuery.refetch()
      },
      onError: (error) => {
        if (
          isBadRequestError<{ error: number; message: string }>(error) ||
          isNotFoundError<{ error: number; message: string }>(error)
        ) {
          toast.error(error.response?.data.message || 'Hủy đơn hàng thất bại')
          return
        }
        toast.error('Hủy đơn hàng thất bại')
      }
    })
  }
  return (
    <>
      <Container maxWidth='lg' sx={{ paddingBottom: '50px' }}>
        <div className='pt-[50px]'>
          <div className=' text-2xl mb-3'>
            <div className='inline-flex gap-2 items-center mb-3'>
              <p className='text-gray-500'>
                <span className='text-gray-700 font-medium'>Đơn Hàng</span> của bạn
              </p>
              <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700' />
            </div>
          </div>
          <form className='max-w-sm py-3'>
            <select
              id='orderStatus'
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '
              onChange={(e) => setOrderStatus(Number(e.target.value) as OrderStatusNumEnum)}
              value={orderStatus}
            >
              <option value={OrderStatusNumEnum.ALL}>{OrderStatusTextEnum.ALL}</option>
              <option value={OrderStatusNumEnum.PENDING}>{OrderStatusTextEnum.PENDING}</option>
              <option value={OrderStatusNumEnum.CONFIRMED}>{OrderStatusTextEnum.CONFIRMED}</option>
              <option value={OrderStatusNumEnum.SHIPPING}>{OrderStatusTextEnum.SHIPPING}</option>
              <option value={OrderStatusNumEnum.DELIVERED}>{OrderStatusTextEnum.DELIVERED}</option>
              <option value={OrderStatusNumEnum.CANCELLED}>{OrderStatusTextEnum.CANCELLED}</option>
            </select>
          </form>

          {myOrdersData?.length > 0 ? (
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                <TableHead>
                  <TableRow sx={{ color: 'black', fontWeight: 800 }}>
                    <TableCell>Nhà Hàng</TableCell>
                    <TableCell align='right'>Ngày đặt</TableCell>
                    <TableCell align='right'>Tổng tiền</TableCell>
                    <TableCell align='right'>Trạng thái</TableCell>
                    <TableCell align='right'></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {myOrdersData.map((order) => {
                    const orderTimeStr = handleTime(order.createdAt)

                    return (
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={order.id}>
                        <TableCell component='th' scope='row'>
                          {order.restaurant}
                        </TableCell>
                        <TableCell align='right'>{orderTimeStr}</TableCell>
                        <TableCell align='right'>{formatPrice(order.totalPrice)}đ</TableCell>
                        <TableCell align='right'>
                          {order.orderStatus !== OrderStatusTextEnum.CANCELLED ? (
                            <span className='bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded  border border-blue-400'>
                              {order.orderStatus}
                            </span>
                          ) : (
                            <span className='bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded  border border-red-400'>
                              {order.orderStatus}
                            </span>
                          )}
                        </TableCell>
                        <TableCell align='right'>
                          <button
                            type='button'
                            className='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 '
                            onClick={() => handleClickOrderDetail(order.id)}
                          >
                            Xem Chi Tiết
                          </button>
                          <button
                            type='button'
                            className='text-red-500 hover:text-white border border-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 '
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            Hủy Đơn Hàng
                          </button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className='pt-[50px] text-center italic'>Không có đơn hàng</div>
          )}
        </div>
      </Container>
      <ModalOrderDetail
        open={openOrderDetailModal}
        handleClose={toggleOrderDetailModal}
        orderDetailId={orderDetailId}
      />
    </>
  )
}

export default MyOrders
