import * as yup from 'yup'

export const RegisterSchema = yup.object({
  email: yup.string().required('Vui lòng nhập email').email('Email không đúng định dạng'),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .matches(
      new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$'),
      'Mật khẩu có ít nhất 8 ký tự, bao gồm chữ cái và số'
    ),
  fullName: yup.string().required('Vui lòng nhập tên đầy đủ'),
  isRestaurant: yup.boolean(),
  isPolicy: yup.boolean()
})
export const LoginSchema = yup.object({
  email: yup.string().required('Vui lòng nhập email'),
  password: yup.string().required('Vui lòng nhập mật khẩu'),
  isRestaurant: yup.boolean()
})

export type ResgisterType = yup.InferType<typeof RegisterSchema>
export type LoginType = yup.InferType<typeof LoginSchema>
