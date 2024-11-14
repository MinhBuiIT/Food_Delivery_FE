import ResponseSuccessType from 'src/types/ResponseSuccessType'
import http from 'src/utils/http'

export const callPaymentApi = (data: { amount: number; bankCode?: string }) => {
  return http.post<ResponseSuccessType<string>>('/payment/vn-pay', data)
}
