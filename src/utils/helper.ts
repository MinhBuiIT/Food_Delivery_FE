import axios, { AxiosError } from 'axios'
import { EventTypeEnum } from 'src/enums/EventTypeEnum'
import { PaymentEnum } from 'src/enums/PaymentEnum'

export const isAxiosErr = <T>(err: unknown): err is AxiosError<T> => {
  return axios.isAxiosError(err)
}
export const isUnthenticatedError = <T>(err: unknown): err is AxiosError<T> => {
  return isAxiosErr(err) && err.response?.status === 401
}
export const isForbiddenError = <T>(err: unknown): err is AxiosError<T> => {
  return isAxiosErr(err) && err.response?.status === 403
}
export const isNotFoundError = <T>(err: unknown): err is AxiosError<T> => {
  return isAxiosErr(err) && err.response?.status === 404
}
export const isBadRequestError = <T>(err: unknown): err is AxiosError<T> => {
  return isAxiosErr(err) && err.response?.status === 400
}

export const handleNameUser = (name: string) => {
  const nameArr = name.split(' ')
  const lastName = nameArr[nameArr.length - 1]
  const firstName = nameArr[0]
  return firstName[0].toUpperCase() + lastName[0].toUpperCase()
}
export const formatRestaurantName = (name: string) => {
  // Chuyển đổi chuỗi thành chữ thường
  const lowerCaseName = name.toLowerCase()
  // Thay thế các ký tự không phải chữ và số bằng dấu gạch ngang
  let formattedName = lowerCaseName.replace(/[^a-z0-9]/g, '-')
  // Xóa các dấu gạch ngang thừa (nếu có)
  formattedName = formattedName.replace(/-+/, '-')
  if (formattedName.startsWith('-')) {
    formattedName = formattedName.substring(1)
  }
  if (formattedName.endsWith('-')) {
    formattedName = formattedName.substring(0, formattedName.length - 1)
  }
  return formattedName
}
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('de-DE').format(price)
}

export const handleTimeOpening = (time: string) => {
  if (time === '') return null
  //time: 9:00AM - 19:00PM
  const timeArr = time.split(' - ')
  const openTime = timeArr[0]
  const openTimeNum = openTime.split(':')[0]
  const closeTime = timeArr[1]
  const closeTimeNum = closeTime.split(':')[0]
  return { openTime: Number(openTimeNum), closeTime: Number(closeTimeNum) }
}

export const handleTime = (createdAt: string) => {
  const orderDate = new Date(createdAt)
  const orderDateStr = `${orderDate.getDate()}/${orderDate.getMonth() + 1}/${orderDate.getFullYear()}`
  const orderTimeStr = `${orderDate.getHours()}:${orderDate.getMinutes()}:${orderDate.getSeconds()}`
  return `${orderDateStr} ${orderTimeStr}`
}
export const convertOrderStatusTextToNum = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 0
    case 'CONFIRMED':
      return 1
    case 'SHIPPING':
      return 2
    case 'DELIVERED':
      return 3
    case 'CANCELLED':
      return 4
    default:
      return 0
  }
}

export const convertPaymentMethodTextToNum = (status: string) => {
  switch (status) {
    case 'BANK':
      return PaymentEnum.BANK
    case 'HOME':
      return PaymentEnum.HOME
  }
}

export const hanldeCalculatePriceFood = (
  price: number,
  type: EventTypeEnum,
  percent?: number,
  amount?: number,
  quantity: number = 1
) => {
  if (type === EventTypeEnum.PERCENT) {
    return price - (price * (percent as number)) / 100
  }
  return price - (amount as number) * quantity
}
export function fromDateToString(date: Date) /* : String*/ {
  date = new Date(+date)
  date.setTime(date.getTime() - date.getTimezoneOffset() * 60000)
  const dateAsString = date.toISOString().substr(0, 19)
  return dateAsString
}
