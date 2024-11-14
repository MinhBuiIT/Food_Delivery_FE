import axios, { AxiosError, AxiosInstance } from 'axios'
import toast from 'react-hot-toast'
import RoleEnum from 'src/enums/RoleEnum'
import ResponseSuccessType from 'src/types/ResponseSuccessType'
import { isUnthenticatedError } from './helper'
import { clearAll, getItem, removeItem, setItem } from './localStorage'

class Http {
  instance: AxiosInstance
  accessToken: string
  refreshToken: string
  private refreshTokenFlat: Promise<string> | null
  private notAccessToken: string[] = ['/auth/login', '/auth/signup', '/auth/refresh-token']

  constructor() {
    this.accessToken = getItem('accessToken') || ''
    this.refreshToken = getItem('refreshToken') || ''
    this.refreshTokenFlat = null
    this.instance = axios.create({
      baseURL: 'http://localhost:8080/api/v1',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        const url = config.url
        if (this.accessToken && !this.notAccessToken.includes(url || '')) {
          config.headers['Authorization'] = `Bearer ${this.accessToken}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const config = response.config
        if (config.url === '/auth/login' || config.url === '/auth/signup') {
          const data = response.data.metadata
          if (data.role !== RoleEnum.ROLE_USER) {
            throw new Error('Unauthorized')
          }
          const { access_token, refresh_token } = data.token
          const profile = {
            id: data.id,
            email: data.email,
            fullName: data.fullName,
            role: data.role
          }
          this.accessToken = access_token
          this.refreshToken = refresh_token
          setItem('accessToken', access_token)
          setItem('refreshToken', refresh_token)
          setItem('profile', profile)
        } else if (config.url === '/auth/logout') {
          this.accessToken = ''
          this.refreshToken = ''
          removeItem('accessToken')
          removeItem('refreshToken')
          removeItem('profile')
        }

        return response
      },
      (error: AxiosError) => {
        const config = error.config
        if (isUnthenticatedError<{ error: number; message: string }>(error)) {
          console.log('error', error)

          //nếu 401 thì vào đây
          if (error.response?.data.message === 'Token is expired' && error.config?.url !== '/auth/refresh-token') {
            this.refreshTokenFlat = this.refreshTokenFlat
              ? this.refreshTokenFlat
              : this.handleRefreshToken().finally(() => {
                  // phải set lại null để ko gây lặp vô hạn khi access token lần t2 bị stale
                  setTimeout(() => {
                    this.refreshTokenFlat = null
                  }, 5000)
                })
            return this.refreshTokenFlat.then((res) => {
              //phải return để trả về được data sau khi gửi accessTK mới lên headers
              return this.instance({ ...config, headers: { ...config?.headers, authorization: res } })
            })
          }
          //refresh token hết hạn
          this.accessToken = ''
          this.refreshToken = ''
          removeItem('accessToken')
          removeItem('refreshToken')
          removeItem('profile')
          window.location.href = '/'
          toast.error(error.response?.data.message || 'Error')
        }
        return Promise.reject(error)
      }
    )
  }
  private async handleRefreshToken() {
    console.log('refresh token', this.refreshToken)

    return this.instance
      .post<ResponseSuccessType<{ access_token: string; refresh_token: string }>>('/auth/refresh-token', {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token, refresh_token } = res.data.metadata
        setItem('accessToken', access_token)
        setItem('refreshToken', refresh_token)
        this.accessToken = access_token
        this.refreshToken = refresh_token
        return access_token
      })
      .catch((error) => {
        this.accessToken = ''
        this.refreshToken = ''
        clearAll()
        throw error
      })
  }
}

const http = new Http().instance
export default http
