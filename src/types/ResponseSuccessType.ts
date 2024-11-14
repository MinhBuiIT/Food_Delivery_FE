interface ResponseSuccessType<T> {
  code: number
  message: string
  metadata: T
}

export default ResponseSuccessType
