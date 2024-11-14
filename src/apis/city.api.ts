import axios from 'axios'
import ResponseCity from 'src/types/ResponseCity'

interface CityType {
  id: string
  name: string
  name_en: string
  full_name: string
  full_name_en: string
  latitude: string
  longitude: string
}

export const getCityApi = () => {
  return axios.get<ResponseCity<CityType[]>>('https://esgoo.net/api-tinhthanh/1/0.htm')
}
export const getDistrictApi = (cityId: string) => {
  return axios.get<ResponseCity<CityType[]>>(`https://esgoo.net/api-tinhthanh/2/${cityId}.htm`)
}

export const getWardApi = (districtId: string) => {
  return axios.get<ResponseCity<CityType[]>>(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`)
}
