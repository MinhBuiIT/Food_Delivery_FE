//https://esgoo.net/api-tinhthanh
interface ResponseCity<T> {
  error: number
  error_text: string
  data_name: string
  data: T
}
export default ResponseCity
