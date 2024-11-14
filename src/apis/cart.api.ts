import { CartType } from 'src/types/CartType'
import ResponseSuccessType from 'src/types/ResponseSuccessType'
import http from 'src/utils/http'

export interface ItemAddToCartType {
  foodId: number
  quantity: number
  specialInstructions: string
  ingredientIds: number[]
}
export interface ItemUpdateQuantityType {
  cartItemId: number
  quantity: number
}

export const getAllItemInCartApi = () => {
  return http.get<ResponseSuccessType<CartType>>('/cart')
}
export const addItemToCartApi = (data: ItemAddToCartType) => {
  return http.post<ResponseSuccessType<null>>('/cart/add', data)
}
export const updateQuantityItemInCartApi = (data: ItemUpdateQuantityType) => {
  return http.post<ResponseSuccessType<CartType>>('/cart/update-quantity', data)
}
export const removeItemInCartApi = (cartItemId: number) => {
  return http.delete<ResponseSuccessType<null>>(`/cart/item/${cartItemId}`)
}

export const clearAllCartApi = () => {
  return http.delete<ResponseSuccessType<null>>('/cart/clear')
}
