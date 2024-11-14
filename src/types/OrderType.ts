import { OrderStatusTextEnum } from 'src/enums/OrderStatusEnum'
import { AddressType } from './AddressType'
import { FoodType } from './FoodType'
import { IngredientItemType } from './IngredientItem'

export type OrderOptimizedType = {
  id: number
  restaurant: string
  orderStatus: string
  createdAt: string
  totalPrice: number
}
export type OrderType = {
  id: number
  restaurant: string
  address: Omit<AddressType, 'addressDefault'>
  totalPrice: number
  totalItem: number
  orderStatus: OrderStatusTextEnum
  createdAt: string
  payment: string
  orderItems: OrderItemType[]
}

export type OrderItemType = {
  id: number
  quantity: number
  specialInstructions: string
  totalPrice: number
  food: Omit<FoodType, 'ingredientsNum'>
  ingredients: IngredientItemType[]
}
