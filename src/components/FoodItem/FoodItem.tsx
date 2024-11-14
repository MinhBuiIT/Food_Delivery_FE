import AddIcon from '@mui/icons-material/Add'
import { Drawer } from '@mui/material'
import { InvalidateQueryFilters, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { addItemToCartApi, ItemAddToCartType } from 'src/apis/cart.api'
import { EventTypeEnum } from 'src/enums/EventTypeEnum'
import { FoodType } from 'src/types/FoodType'
import { formatPrice, hanldeCalculatePriceFood, isBadRequestError } from 'src/utils/helper'
import FoodDetail from '../FoodDetail'

interface FoodItemProps {
  food: FoodType
}
const FoodItem = ({ food }: FoodItemProps) => {
  const queryClient = useQueryClient()
  const [openDetailFood, setOpenDetailFood] = useState(false)
  const [chooseFood, setChooseFood] = useState<number>(0)

  //API
  const addToCartMutation = useMutation({
    mutationFn: (data: ItemAddToCartType) => addItemToCartApi(data)
  })
  //END API

  const handleAddCart = async (ingredientsNum: number, id: number) => {
    if (ingredientsNum === 0) {
      //đặt hàng ngay
      try {
        await addToCartMutation.mutateAsync({
          foodId: id,
          quantity: 1,
          specialInstructions: '',
          ingredientIds: []
        })
        toast.success('Thêm vào giỏ hàng thành công')
        queryClient.invalidateQueries(['getCart'] as InvalidateQueryFilters)
      } catch (error) {
        if (isBadRequestError<{ error: number; message: string }>(error)) {
          toast.error(error.response?.data.message || 'Bad request')
        }
      }
    } else {
      handleChooseFood(id)
    }
  }
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenDetailFood(newOpen)
  }
  const handleChooseFood = (id: number) => {
    setOpenDetailFood(true)
    setChooseFood(id)
  }

  return (
    <>
      <div className='w-full min-h-[70px] p-3 rounded shadow-sm bg-white hover:border hover:border-pri-dark cursor-pointer'>
        <div className='w-full flex items-start gap-3' onClick={() => handleChooseFood(food.id)}>
          <div className='w-[35%] rounded overflow-hidden' style={{ aspectRatio: '1/1' }}>
            <img src={food.images[0]} className='w-full h-full object-cover' />
          </div>
          <div>
            <h4 className='text-[21px] font-normal pb-[20px]'>{food.name}</h4>
            <div className='text-gray-500 pb-[20px]'>{food.description}</div>
            <div className='flex items-center gap-3 relative'>
              <div className={`${food.event ? 'text-[20px] line-through text-gray-500' : 'text-[23px] text-black'} `}>
                {formatPrice(Number(food.price))}đ
              </div>
              {food.event && (
                <div className='text-[25px] text-black'>
                  {formatPrice(
                    hanldeCalculatePriceFood(Number(food.price), food.event.type, food.event.percent, food.event.amount)
                  )}
                  đ
                </div>
              )}
            </div>
            {food.event && (
              <div>
                <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded '>
                  Giảm{' '}
                  {food.event.type === EventTypeEnum.PERCENT
                    ? food.event?.percent + '%'
                    : formatPrice(food.event?.amount as number) + 'đ'}
                </span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => handleAddCart(food.ingredientsNum, food.id)}
          className='w-[35px] h-[35px] flex items-center justify-center bg-pri-btn mt-3 rounded-full ml-auto'
        >
          <AddIcon className='text-white' />
        </button>
      </div>
      <Drawer open={openDetailFood} onClose={toggleDrawer(false)} anchor='right'>
        <FoodDetail setOpenDetailFood={setOpenDetailFood} chooseFood={chooseFood} />
      </Drawer>
    </>
  )
}

export default FoodItem
