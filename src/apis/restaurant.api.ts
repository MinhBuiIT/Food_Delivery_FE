import ResponseSuccessType from 'src/types/ResponseSuccessType'
import { RestaurantFavoriteType, RestaurantType } from 'src/types/RestaurantType'
import http from 'src/utils/http'

export interface RestaurantListType {
  content: RestaurantType[]
  totalPages: number
  currentPage: number
  totalElements: number
}

export const getAllRestaurantsApi = ({ page, limit }: { page: number; limit: number }) => {
  return http.get<ResponseSuccessType<RestaurantListType>>(`/restaurant/all?page=${page}&size=${limit}`)
}
export const getTotalPageRestaurantsApi = ({ page, limit }: { page: number; limit: number }) => {
  return http.get<ResponseSuccessType<number>>(`/restaurant/total-page?page=${page}&size=${limit}`)
}

export const getRestaurantByIdApi = (id: number) => {
  return http.get<ResponseSuccessType<RestaurantType>>(`/restaurant/${id}`)
}

export const searchRestaurantApi = (key: string) => {
  return http.get<ResponseSuccessType<RestaurantType[]>>(`/restaurant/search?key=${key}`)
}

export const changeLikeRestaurantApi = (id: number) => {
  return http.post<ResponseSuccessType<null>>(`/restaurant/${id}/like`)
}

export const getMyFavoriteRestaurantApi = () => {
  return http.get<ResponseSuccessType<RestaurantFavoriteType[]>>(`/restaurant/likes`)
}
