import { AddressType } from 'src/types/AddressType'
import ResponseSuccessType from 'src/types/ResponseSuccessType'
import http from 'src/utils/http'

export const getAddressDefaultApi = () => {
  return http.get<ResponseSuccessType<AddressType>>('/address/me/default')
}

export const addAddressApi = (data: Omit<AddressType, 'id' | 'addressDefault'>) => {
  return http.post<ResponseSuccessType<Omit<AddressType, 'id' | 'addressDefault'>>>('/address', data)
}

export const getAddressListApi = () => {
  return http.get<ResponseSuccessType<AddressType[]>>('/address/me')
}

export const updateDefaultAddressApi = (id: number) => {
  return http.post<ResponseSuccessType<null>>(`/address/me/default/${id}`)
}
