import ResponseSuccessType from 'src/types/ResponseSuccessType'
import UserProfile from 'src/types/UserProfile'
import http from 'src/utils/http'
import { ResgisterType } from 'src/utils/rules'

interface AuthResponse extends UserProfile {
  token: {
    access_token: string
    refresh_token: string
  }
}

export const registerApi = (body: Pick<ResgisterType, 'email' | 'fullName' | 'isRestaurant' | 'password'>) => {
  return http.post<ResponseSuccessType<AuthResponse>>('/auth/signup', body)
}

export const loginApi = (body: { email: string; password: string }) => {
  return http.post<ResponseSuccessType<AuthResponse>>('/auth/login', body)
}
export const logoutApi = () => {
  return http.post<ResponseSuccessType<null>>('/auth/logout')
}
