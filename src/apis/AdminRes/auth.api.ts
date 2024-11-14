import ResponseSuccessType from 'src/types/ResponseSuccessType'
import UserProfile from 'src/types/UserProfile'
import httpRes from 'src/utils/httpRes'
import { ResgisterType } from 'src/utils/rules'

interface AuthResponse extends UserProfile {
  token: {
    access_token: string
    refresh_token: string
  }
}

export const registerResApi = (body: Pick<ResgisterType, 'email' | 'fullName' | 'isRestaurant' | 'password'>) => {
  return httpRes.post<ResponseSuccessType<AuthResponse>>('/auth/signup', body)
}
export const loginResApi = (body: { email: string; password: string }) => {
  return httpRes.post<ResponseSuccessType<AuthResponse>>('/auth/login', body)
}
export const logoutResApi = () => {
  return httpRes.post<ResponseSuccessType<null>>('/auth/logout')
}
