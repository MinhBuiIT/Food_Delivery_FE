/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderStatusNumEnum } from 'src/enums/OrderStatusEnum'
import { EventType, EventTypeBody } from 'src/types/EventType'
import { FoodAdminType } from 'src/types/FoodType'
import { IngredientItemType, IngredientItemWithCategoryType } from 'src/types/IngredientItem'
import ResponseSuccessType from 'src/types/ResponseSuccessType'
import { RestaurantType } from 'src/types/RestaurantType'
import httpRes from 'src/utils/httpRes'

export interface IngredientItemCategoryType {
  id: number
  name: string
  pick: boolean
  ingredients: IngredientItemType[]
}

export interface IngredientItemBody {
  name: string
  price: number
  categoryIngredient: string
}

export const createRestaurantApi = (body: FormData) => {
  return httpRes.post<ResponseSuccessType<any>>('/restaurant', body, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export const getRestaurantByOwnerApi = () => {
  return httpRes.get<ResponseSuccessType<RestaurantType>>('/restaurant/by-owner')
}
export const changeStatusRestaurantApi = (id: number) => {
  return httpRes.post<ResponseSuccessType<RestaurantType>>(`/restaurant/${id}/change-status`)
}
export const getCategoryListResApi = (id: number) => {
  return httpRes.get<ResponseSuccessType<{ id: number; name: string }[]>>(`category-food/restaurant/${id}`)
}
export const createCategoryFoodApi = (body: { name: string }) => {
  return httpRes.post<ResponseSuccessType<{ id: number; name: string }>>('/category-food', body)
}
export const updateCategoryFoodApi = (body: { name: string; id: number }) => {
  return httpRes.put<ResponseSuccessType<{ id: number; name: string }>>(`/category-food/${body.id}`, body)
}
export const getIngredientCateListApi = () => {
  return httpRes.get<ResponseSuccessType<{ id: number; name: string; pick: boolean }[]>>(
    `/category-ingredient/restaurant`
  )
}
export const addIngredientCateApi = (body: { name: string; pick: boolean }) => {
  return httpRes.post<ResponseSuccessType<{ id: number; name: string; pick: boolean }>>('/category-ingredient', body)
}
export const updateIngredientCateApi = (body: { id: number; name: string; pick: boolean }) => {
  return httpRes.put<ResponseSuccessType<{ id: number; name: string; pick: boolean }>>(
    `/category-ingredient/${body.id}`,
    body
  )
}
export const getAllIngredientApi = () => {
  return httpRes.get<ResponseSuccessType<IngredientItemCategoryType[]>>('/ingredient-item/restaurant')
}

export const addIngredientApi = (body: IngredientItemBody) => {
  return httpRes.post<ResponseSuccessType<IngredientItemWithCategoryType>>('/ingredient-item', body)
}
export const updateIngredientApi = (body: Omit<IngredientItemBody, 'categoryIngredient'> & { id: number }) => {
  return httpRes.put<ResponseSuccessType<IngredientItemWithCategoryType>>(`/ingredient-item/${body.id}`, body)
}
export const deleteIngredientApi = (id: number) => {
  return httpRes.delete<ResponseSuccessType<null>>(`/ingredient-item/${id}`)
}
export const updateStockIngredientApi = (id: number) => {
  return httpRes.post<ResponseSuccessType<IngredientItemWithCategoryType>>(`ingredient-item/${id}/status`)
}
export const getFoodListApi = () => {
  return httpRes.get<ResponseSuccessType<FoodAdminType[]>>(`/food/restaurant/all`)
}
export const getFoodDetailApi = (id: number) => {
  return httpRes.get<ResponseSuccessType<FoodAdminType & { ingredients: IngredientItemType[] }>>(
    `/food/restaurant/${id}/detail`
  )
}
export const createFoodApi = (body: FormData) => {
  return httpRes.post<ResponseSuccessType<FoodAdminType & { ingredients: IngredientItemType[] }>>('/food', body, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export const changeAvailableFoodApi = (id: number) => {
  return httpRes.post<ResponseSuccessType<null>>(`/food/${id}/available`)
}
export const changeDisableFoodApi = (id: number) => {
  return httpRes.post<ResponseSuccessType<null>>(`/food/${id}/disable`)
}
export const getOrdersApi = (status: OrderStatusNumEnum) => {
  return httpRes.get<ResponseSuccessType<any>>(`/order/${status}/restaurant`)
}
export const changeStatusOrderApi = (id: number, status: OrderStatusNumEnum) => {
  return httpRes.post<ResponseSuccessType<any>>(`/order/${id}/status`, { status })
}

export const getEventListApi = (active: number = -1) => {
  return httpRes.get<ResponseSuccessType<EventType[]>>('/event/list?active=' + active)
}

export const createEventApi = (body: EventTypeBody) => {
  return httpRes.post<ResponseSuccessType<EventType>>('/event', body)
}

export const changeActiveEventApi = (body: { id: number }) => {
  return httpRes.post<ResponseSuccessType<EventType>>('/event/change-active', body)
}
