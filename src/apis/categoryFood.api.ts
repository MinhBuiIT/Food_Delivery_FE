import ResponseSuccessType from 'src/types/ResponseSuccessType'
import http from 'src/utils/http'

export const getCategoryFoodOfResApi = (id: number) => {
  return http.get<ResponseSuccessType<{ name: string }[]>>(`/category-food/restaurant/${id}`)
}
