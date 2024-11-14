import { useMutation } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { createOrderApi } from 'src/apis/order.api'
import { PaymentEnum } from 'src/enums/PaymentEnum'
import { getItem, removeItem } from 'src/utils/localStorage'

const OrderPayment = () => {
  const { search } = useLocation()
  const [callOrderSuccess, setCallOrderSuccess] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const query = new URLSearchParams(search)
  const isSuccess = query.get('status') === 'success'
  const createOrderMutation = useMutation({
    mutationFn: (data: { addressId: number; restaurantId: number; payment: PaymentEnum }) => createOrderApi(data),
    onSuccess: () => {
      setCallOrderSuccess(true)
      removeItem('address')
      removeItem('restaurant')
    },
    onError: () => {
      setCallOrderSuccess(false)
    },
    onSettled: () => {
      setIsLoaded(true)
    }
  })

  const hasCalledApi = useRef(false)
  useEffect(() => {
    if (isSuccess && !hasCalledApi.current) {
      hasCalledApi.current = true // Prevent calling the API multiple times
      const addressId = getItem('address')
      const restaurantId = getItem('restaurant')
      createOrderMutation.mutateAsync({ addressId, restaurantId, payment: PaymentEnum.BANK })
    }
  }, [])
  const success = isSuccess && callOrderSuccess

  return (
    <>
      {!isLoaded ? (
        <div role='status' className='w-full h-[100vh] flex items-center justify-center'>
          <svg
            aria-hidden='true'
            className='w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600'
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
        <div className='bg-gray-100 h-screen flex items-center justify-center'>
          <div className='bg-white p-6  md:mx-auto'>
            {success ? (
              <svg viewBox='0 0 24 24' className='text-green-600 w-16 h-16 mx-auto my-6'>
                <path
                  fill='currentColor'
                  d='M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z'
                ></path>
              </svg>
            ) : (
              <svg viewBox='0 0 24 24' className='text-red-600 w-16 h-16 mx-auto my-6'>
                <path
                  d='M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z'
                  fill='currentColor'
                />
                <path d='M12 14V7' stroke='currentColor' strokeWidth='2' />
                <path
                  d='M12 21C16.9706 21 21 16.9706 21 12C21 7.0294 16.9706 2.99994 12 2.99994C7.0294 2.99994 2.99994 7.0294 2.99994 12C2.99994 16.9706 7.0294 21 12 21Z'
                  stroke='currentColor'
                  strokeWidth='1.99991'
                  fill='transparent'
                />
              </svg>
            )}

            <div className='text-center'>
              <h3 className='md:text-2xl text-base text-gray-900 font-semibold text-center'>
                {success ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
              </h3>
              {success && (
                <>
                  <p className='text-gray-600 my-2'>Cảm ơn bạn đã hoàn tất thanh toán trực tuyến của mình.</p>
                  <p> Have a great day!</p>
                </>
              )}

              <div className='py-10 text-center'>
                <Link to='/' className='px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3'>
                  Quay về
                </Link>
              </div>
            </div>
          </div>
          )
        </div>
      )}
    </>
  )
}

export default OrderPayment
