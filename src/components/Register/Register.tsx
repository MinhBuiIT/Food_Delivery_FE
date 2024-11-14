import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { registerResApi } from 'src/apis/AdminRes/auth.api'
import { registerApi } from 'src/apis/auth.api'
import { MyAppAuthContext } from 'src/context/AppAuthContext'
import { MyAppModalContext } from 'src/context/AppModalContext'
import { ResponseErrorType } from 'src/types/ResponseErrorType'
import { isBadRequestError, isUnthenticatedError } from 'src/utils/helper'
import { RegisterSchema, ResgisterType } from 'src/utils/rules'

const Register = () => {
  const navigate = useNavigate()
  const { setProfile, setIsAuth, setIsAuthResAdmin, setProfileOwner } = useContext(MyAppAuthContext)
  const { setAuthModal } = useContext(MyAppModalContext)

  const registerMutation = useMutation({
    mutationFn: (data: Pick<ResgisterType, 'email' | 'fullName' | 'isRestaurant' | 'password'>) => registerApi(data)
  })
  const registerResMutation = useMutation({
    mutationFn: (data: Pick<ResgisterType, 'email' | 'fullName' | 'isRestaurant' | 'password'>) => registerResApi(data)
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResgisterType>({
    resolver: yupResolver(RegisterSchema)
  })
  const onSubmit = (data: ResgisterType) => {
    if (!data.isPolicy) {
      toast.error('Vui lòng đồng ý với chính sách của chúng tôi', {
        position: 'top-center'
      })
      return
    }
    const configData = {
      fullName: data.fullName,
      password: data.password,
      email: data.email,
      isRestaurant: false
    }
    const toastId = toast.loading('Đang đăng ký...', {
      position: 'top-center'
    })
    if (!configData.isRestaurant) {
      registerMutation.mutate(configData, {
        onSuccess: (res) => {
          const data = res.data.metadata
          setProfile({
            id: data.id,
            email: data.email,
            fullName: data.fullName,
            role: data.role
          })
          setIsAuth(true)
          setAuthModal(false)
          toast.dismiss(toastId)
          toast.success('Đăng ký thành công', {
            position: 'top-center'
          })
        },
        onError: (error) => {
          toast.dismiss(toastId)
          if (isUnthenticatedError<ResponseErrorType>(error) || isBadRequestError<ResponseErrorType>(error)) {
            const message = error.response?.data.message || 'Error'
            toast.error(message, {
              position: 'top-center'
            })
          }
        }
      })
    } else {
      registerResMutation.mutate(configData, {
        onSuccess: (res) => {
          const data = res.data.metadata
          setProfileOwner({
            id: data.id,
            email: data.email,
            fullName: data.fullName,
            role: data.role
          })
          setIsAuthResAdmin(true)
          setAuthModal(false)
          toast.dismiss(toastId)
          toast.success('Đăng ký thành công', {
            position: 'top-center'
          })
          navigate('/admin/restaurant/create')
        },
        onError: (error) => {
          toast.dismiss(toastId)
          if (isUnthenticatedError<ResponseErrorType>(error) || isBadRequestError<ResponseErrorType>(error)) {
            const message = error.response?.data.message || 'Error'
            toast.error(message, {
              position: 'top-center'
            })
          }
        }
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='mt-[24px]'>
      <div className='mb-5'>
        <input
          type='text'
          placeholder='Tên Đầy Đủ'
          className='w-full px-3 py-2 border border-slate-400 outline-none text-gray-600 text-[18px] '
          {...register('fullName')}
        />
        <span className='text-red-500 text-[14px]'>{errors.fullName?.message}</span>
      </div>

      <div className='mb-5'>
        <input
          type='text'
          placeholder='Email'
          className='w-full px-3 py-2 border border-slate-400 outline-none text-gray-600 text-[18px]'
          {...register('email')}
        />

        <span className='text-red-500 text-[14px]'>{errors.email?.message}</span>
      </div>

      <div className='mb-3'>
        <input
          type='password'
          placeholder='Mật Khẩu'
          className='w-full px-3 py-2 border border-slate-400 outline-none text-gray-600 text-[18px] '
          {...register('password')}
        />
        <span className='text-red-500 text-[14px]'>{errors.password?.message}</span>
      </div>
      {/* <div className='flex items-center gap-2 mb-3'>
        <input type='checkbox' {...register('isRestaurant')} />
        <span>Đăng ký với vai trò nhà hàng</span>
      </div> */}

      <button type='submit' className='w-full py-2 bg-orange-500 text-white font-semibold text-[18px]'>
        {registerMutation.isPending ? (
          <div role='status'>
            <svg
              aria-hidden='true'
              className='inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentFill'
              />
            </svg>
            <span className='sr-only'>Loading...</span>
          </div>
        ) : (
          'Đăng Ký'
        )}
      </button>
      <div className='flex items-center gap-2 mt-3'>
        <input type='checkbox' {...register('isPolicy')} />
        <span>Đồng ý chính sách, dịch vụ của chúng tôi</span>
      </div>
    </form>
  )
}

export default Register