import { OrderStatusNumEnum } from 'src/enums/OrderStatusEnum'
import { PaymentEnum } from 'src/enums/PaymentEnum'
import { OrderOptimizedType, OrderType } from 'src/types/OrderType'
import ResponseSuccessType from 'src/types/ResponseSuccessType'
import http from 'src/utils/http'

export const createOrderApi = (data: { addressId: number; restaurantId: number; payment: PaymentEnum }) => {
  return http.post<ResponseSuccessType<unknown>>('/order', data)
}
export const getOrdersApi = (status: OrderStatusNumEnum) => {
  return http.get<ResponseSuccessType<OrderOptimizedType[]>>(`/order/${status}/me`)
}
export const getOrderDetailApi = (orderId: number) => {
  return http.get<ResponseSuccessType<OrderType>>(`/order/${orderId}`)
}
export const cancelOrderApi = (orderId: number) => {
  return http.post<ResponseSuccessType<unknown>>(`/order/${orderId}/cancel`)
}
