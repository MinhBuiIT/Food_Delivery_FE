import { Container } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { getAddressDefaultApi } from 'src/apis/address.api'
import { getAllItemInCartApi } from 'src/apis/cart.api'
import { createOrderApi } from 'src/apis/order.api'
import { callPaymentApi } from 'src/apis/payment.api'
import ModalAddAddress from 'src/components/ModalAddAddress'
import ModalAddressList from 'src/components/ModalAddressList'
import { PaymentEnum } from 'src/enums/PaymentEnum'
import { formatPrice, hanldeCalculatePriceFood } from 'src/utils/helper'
import { setItem } from 'src/utils/localStorage'

const ReviewOrder = () => {
  const navigate = useNavigate()
  const [openAddAddressModal, setOpenAddAddressModal] = useState(false)
  const [openAddressListModal, setOpenAddressListModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<number>(0)
  //API
  const getCartQuery = useQuery({
    queryKey: ['getCartOrder'],
    queryFn: () => getAllItemInCartApi()
  })
  const getAddressDefaultQuery = useQuery({
    queryKey: ['getAddressDefault'],
    queryFn: getAddressDefaultApi
  })
  const callPaymentMutation = useMutation({
    mutationFn: (data: { amount: number; bankCode?: string }) => {
      return callPaymentApi(data)
    }
  })
  const createOrderMutation = useMutation({
    mutationFn: (data: { addressId: number; restaurantId: number; payment: PaymentEnum }) => createOrderApi(data),
    onSuccess: () => {
      toast.success('Đặt hàng thành công')
      navigate('/my-order')
    },
    onError: () => {
      toast.error('Đặt hàng thất bại')
    }
  })

  //END API
  const cartData = getCartQuery.data?.data.metadata || null

  const totalPriceFoodOrignal =
    useMemo(
      () =>
        cartData?.items.reduce((total, item) => {
          return total + Number(item.totalPrice)
        }, 0),
      [cartData]
    ) || 0

  const totalPriceFood =
    useMemo(
      () =>
        cartData?.items.reduce((total, item) => {
          if (!item.event) return total + Number(item.totalPrice)
          return (
            total +
            hanldeCalculatePriceFood(
              Number(item.totalPrice),
              item.event.type,
              item.event.percent,
              item.event.amount,
              item.quantity
            )
          )
        }, 0),
      [cartData]
    ) || 0
  const totalPriceDecrease = totalPriceFoodOrignal - totalPriceFood

  const addressDefault = getAddressDefaultQuery.data?.data.metadata || null

  const toggleAddAddressModal = (open: boolean) => {
    setOpenAddAddressModal(open)
  }
  const toggleAddressListModal = (open: boolean) => {
    setOpenAddressListModal(open)
  }

  const handleConfirmOrder = async (data: { amount: number; bankCode?: string }) => {
    if (paymentMethod === 0) {
      try {
        const response = await callPaymentMutation.mutateAsync(data)
        const redirectUrl = response.data.metadata
        //localStorage
        setItem('address', addressDefault?.id)
        setItem('restaurant', cartData?.restaurantId)

        window.location.href = redirectUrl
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error: unknown) {
        toast.error('Đã có lỗi xảy ra')
      }
    } else if (paymentMethod === 1) {
      if (!addressDefault || !cartData) {
        toast.error('Đã có lỗi xảy ra')
        return
      }
      createOrderMutation.mutate({
        addressId: addressDefault.id,
        restaurantId: cartData.restaurantId,
        payment: PaymentEnum.HOME
      })
    }
  }

  return (
    <Container maxWidth='lg'>
      {cartData && (
        <div className='border-t pt-14'>
          <div className=' text-2xl mb-3'>
            <div className='inline-flex gap-2 items-center mb-3'>
              <p className='text-gray-500'>
                <span className='text-gray-700 font-medium'>Đơn Hàng</span> Của Bạn
              </p>
              <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700' />
            </div>
          </div>
          {addressDefault ? (
            <div className='text-xl pb-3'>
              <span className='text-black font-semibold mr-8'>{addressDefault.phone}</span>
              <span className='text-gray-600 '>
                {addressDefault.numberStreet +
                  ', ' +
                  addressDefault.street +
                  ', ' +
                  addressDefault.ward +
                  ', ' +
                  addressDefault.district +
                  ', ' +
                  addressDefault.city}
              </span>
              <button className='text-pri-dark text-xl pb-3 ml-5' onClick={() => toggleAddressListModal(true)}>
                Thay đổi địa chỉ
              </button>
            </div>
          ) : (
            <button onClick={() => toggleAddAddressModal(true)} className='text-pri-dark text-xl pb-3'>
              + Thêm địa chỉ
            </button>
          )}
          <div className='flex items-center gap-5 mb-6'>
            <div className='flex items-center '>
              <input
                id='default-radio-1'
                type='radio'
                name='default-radio'
                className='w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 '
                value={0}
                checked={paymentMethod === 0}
                onChange={(e) => {
                  if (e.target.checked) {
                    setPaymentMethod(0)
                  }
                }}
              />
              <label htmlFor='default-radio-1' className='ms-2 text-[18px] font-medium text-gray-900 '>
                Chuyển khoản
              </label>
            </div>
            <div className='flex items-center'>
              <input
                id='default-radio-2'
                type='radio'
                name='default-radio'
                className='w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 '
                value={1}
                checked={paymentMethod === 1}
                onChange={(e) => {
                  if (e.target.checked) {
                    setPaymentMethod(1)
                  }
                }}
              />
              <label htmlFor='default-radio-2' className='ms-2 text-[18px] font-medium text-gray-900 '>
                Thanh toán khi nhận món ăn
              </label>
            </div>
          </div>
          <div>
            {cartData?.items.map((item) => {
              return (
                <div
                  className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'
                  key={item.id}
                >
                  <div className=' flex items-start gap-6'>
                    <img className='w-16 sm:w-20' src={item.food.images[0]} />
                    <div>
                      <p className='text-xs sm:text-lg font-medium'>{item.food.name}</p>
                      {/* thành phần */}
                      <div className='flex flex-col text-gray-600 text-[14px]'>
                        {item.ingredients.map((ingredient) => (
                          <div className='line-clamp-1' key={ingredient.id}>
                            {ingredient.name}
                          </div>
                        ))}
                        <div className='line-clamp-1'>{item.specialInstructions}</div>
                      </div>
                    </div>
                  </div>
                  <span>{item.quantity}</span>
                  <div>
                    {item.event
                      ? formatPrice(
                          hanldeCalculatePriceFood(
                            Number(item.totalPrice),
                            item.event.type,
                            item.event.percent,
                            item.event.amount,
                            item.quantity
                          )
                        )
                      : formatPrice(Number(item.totalPrice))}
                  </div>
                </div>
              )
            })}
          </div>
          <div className='flex justify-end my-20'>
            <div className='w-full sm:w-[450px]'>
              <div className='w-full'>
                <div className='text-2xl'>
                  <div className='inline-flex gap-2 items-center mb-3'>
                    <p className='text-gray-500'>
                      <span className='text-gray-700 font-medium'>Tổng Cộng</span>
                    </p>
                    <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700' />
                  </div>
                </div>
                <div className='flex flex-col gap-2 mt-2 text-base'>
                  <div className='flex justify-between'>
                    <p>Giá món ăn (chưa giảm giá)</p>
                    <p>{formatPrice(totalPriceFoodOrignal)}đ</p>
                  </div>
                  <hr />
                  <div className='flex justify-between'>
                    <p>Giảm giá</p>
                    <p>{formatPrice(totalPriceDecrease)}đ</p>
                  </div>
                  <hr />
                  <div className='flex justify-between'>
                    <b>Thanh toán</b>
                    <b>{formatPrice(totalPriceFood)}đ</b>
                  </div>
                </div>
              </div>
              <div className=' w-full text-end'>
                <button
                  disabled={addressDefault === null}
                  className={`${addressDefault === null ? 'bg-gray-500' : 'bg-pri-dark'} text-white text-base my-8 px-8 py-3`}
                  onClick={() => handleConfirmOrder({ amount: cartData.totalPrice })}
                >
                  XÁC NHẬN ĐƠN HÀNG
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ModalAddAddress openAddAddressModal={openAddAddressModal} toggleAddAddressModal={toggleAddAddressModal} />
      <ModalAddressList
        openAddressListModal={openAddressListModal}
        toggleAddressListModal={toggleAddressListModal}
        toggleAddAddressModal={toggleAddAddressModal}
      />
    </Container>
  )
}

export default ReviewOrder
