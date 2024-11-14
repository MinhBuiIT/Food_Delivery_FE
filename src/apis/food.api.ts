import { FoodDetailType, FoodWithCategoryType } from 'src/types/FoodType'
import ResponseSuccessType from 'src/types/ResponseSuccessType'
import http from 'src/utils/http'

export const getAllFoodOfResApi = (id: number) => {
  return http.get<ResponseSuccessType<FoodWithCategoryType[]>>(`/food/restaurant/${id}`)
}
export const getIngredientOfFoodApi = (id: number) => {
  return http.get<ResponseSuccessType<FoodDetailType>>(`/food/${id}/ingredients`)
}
