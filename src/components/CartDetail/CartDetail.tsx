import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined'
import { Divider } from '@mui/material'
import { InvalidateQueryFilters, useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import {
  clearAllCartApi,
  ItemUpdateQuantityType,
  removeItemInCartApi,
  updateQuantityItemInCartApi
} from 'src/apis/cart.api'
import { CartType } from 'src/types/CartType'
import { formatPrice, hanldeCalculatePriceFood, isBadRequestError } from 'src/utils/helper'
import emptyCart from '../../assets/ilus-basket-empty.svg'

interface CartDetailProps {
  cartData: CartType | null
  setOpenDetailCart: React.Dispatch<React.SetStateAction<boolean>>
}

const CartDetail = ({ cartData, setOpenDetailCart }: CartDetailProps) => {
  const queryClient = useQueryClient()
  const updateQuantityMutation = useMutation({
    mutationFn: (data: ItemUpdateQuantityType) => {
      return updateQuantityItemInCartApi(data)
    }
  })
  const removeCartItemMutation = useMutation({
    mutationFn: (cartItemId: number) => {
      return removeItemInCartApi(cartItemId)
    }
  })
  const clearAllCartMutation = useMutation({
    mutationFn: () => clearAllCartApi()
  })
  const handleUpdateQuantity = (cartItemId: number, quantity: number, count: number) => {
    updateQuantityMutation.mutate(
      { cartItemId, quantity: quantity + count },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['getCart'] as InvalidateQueryFilters)
        },
        onError: (error) => {
          toast.error(error.message)
        }
      }
    )
  }
  const handleRemoveItem = (cartItemId: number) => {
    removeCartItemMutation.mutate(cartItemId, {
      onSuccess: () => {
        toast.success('Xóa món ăn thành công')
        queryClient.invalidateQueries(['getCart'] as InvalidateQueryFilters)
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  }
  const handleClearAllCart = async () => {
    try {
      await clearAllCartMutation.mutateAsync()
      queryClient.invalidateQueries(['getCart'] as InvalidateQueryFilters)
      toast.success('Món ăn trong giỏ hàng đã được xóa thành công')
    } catch (error) {
      if (isBadRequestError<{ error: number; message: string }>(error))
        toast.error(error.response?.data.message || 'Error')
    }
  }
  //sort cart item by name
  const cartItemSort = useMemo(() => cartData?.items.sort((a, b) => +(a.quantity < b.quantity)), [cartData])
  const totalPriceCart = useMemo(
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
  )

  return (
    <>
      {cartItemSort && cartItemSort.length > 0 ? (
        <div className='sm:w-[60vw] md:w-[32vw] bg-white min-h-[100vh] flex flex-col'>
          <div>
            <button className='px-4 pb-3' onClick={() => setOpenDetailCart(false)}>
              <CloseOutlinedIcon sx={{ fontSize: '26px' }} />
            </button>
          </div>
          <Divider />
          <div className='text-center text-[24px] font-semibold pt-[20px]'>Giỏ hàng của bạn</div>
          <div className='flex-1 pt-[20px] px-3'>
            {cartItemSort.map((item) => {
              const totalPriceFood = item.event
                ? formatPrice(
                    hanldeCalculatePriceFood(
                      Number(item.totalPrice),
                      item.event.type,
                      item.event.percent,
                      item.event.amount,
                      item.quantity
                    )
                  )
                : formatPrice(Number(item.totalPrice))
              return (
                <React.Fragment key={item.id}>
                  <div className='flex items-center justify-between py-[16px]'>
                    <div className='flex items-center max-w-[80%] gap-3'>
                      {item.quantity === 1 ? (
                        <button onClick={() => handleRemoveItem(item.id)}>
                          <DeleteOutlineOutlinedIcon className='text-blue-500' />
                        </button>
                      ) : (
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}>
                          <RemoveOutlinedIcon className='text-blue-500' />
                        </button>
                      )}

                      <span>{item.quantity}</span>
                      <button>
                        <AddOutlinedIcon
                          className='text-blue-500'
                          onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                        />
                      </button>

                      <div className='w-[48px] h-[48px] rounded overflow-hidden'>
                        <img src={item.food.images[0]} className='w-full h-full object-cover' />
                      </div>
                      <div>
                        <div className='line-clamp-1 text-[18px] text-black'>{item.food.name}</div>
                        {item.ingredients.length > 0 &&
                          item.ingredients.map((ingredient) => {
                            return (
                              <div key={ingredient.id} className='line-clamp-1 text-[16px] text-gray-500'>
                                {ingredient.name}
                              </div>
                            )
                          })}
                        <div className='line-clamp-1 text-[16px] text-gray-500'>{item.specialInstructions}</div>
                      </div>
                    </div>
                    <div className='text-[18px] font-semibold'>{totalPriceFood}đ</div>
                  </div>
                  <Divider />
                </React.Fragment>
              )
            })}
            <div className='flex items-center pt-[16px] text-[22px] justify-between'>
              <div>Tổng số tiền: </div>
              <div className='font-semibold'>{formatPrice(Number(totalPriceCart))}đ</div>
            </div>
          </div>
          <div className='w-full  bg-white sticky bottom-0 left-0 right-0  pb-[20px] pt-[12px] shadow-lg px-3 border-t border-gray-300'>
            <div className='flex items-center  text-[28px] mb-3 justify-between '>
              <div>Tổng số tiền: </div>
              <div className='font-semibold'>{formatPrice(Number(totalPriceCart))}đ</div>
            </div>
            <div className='flex items-center gap-2'>
              <Link
                to={'/order/review'}
                className={`w-[70%] text-xl  bg-green-400 text-white text-center rounded py-2`}
              >
                Xem Đơn Hàng
              </Link>
              <button
                className={`w-[30%] text-xl  bg-red-400 text-white text-center rounded py-2`}
                onClick={handleClearAllCart}
              >
                Xóa tất cả
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className='sm:w-[60vw] md:w-[32vw] bg-white min-h-[100vh] flex flex-col'>
          <div>
            <button className='px-4 pb-3' onClick={() => setOpenDetailCart(false)}>
              <CloseOutlinedIcon sx={{ fontSize: '26px' }} />
            </button>
          </div>
          <Divider />
          <div className='flex flex-col flex-1 items-center justify-center'>
            <img src={emptyCart} alt='Empty Cart' />
            <div className='text-[20px] text-black font-semibold'>Bắt đầu với EatFast</div>
            <div className='text-[16px] text-gray-600'>Thêm sản phẩm vào giỏ hàng của bạn và đặt hàng tại đây.</div>
          </div>
        </div>
      )}
    </>
  )
}

export default CartDetail
