import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined'
import { Divider } from '@mui/material'
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { addItemToCartApi, ItemAddToCartType } from 'src/apis/cart.api'
import { getIngredientOfFoodApi } from 'src/apis/food.api'
import { formatPrice } from 'src/utils/helper'
import IngredientRequiredList from '../IngredientList'

interface FoodDetailProps {
  setOpenDetailFood: React.Dispatch<React.SetStateAction<boolean>>
  chooseFood: number
}
const FoodDetail = ({ setOpenDetailFood, chooseFood }: FoodDetailProps) => {
  const queryClient = useQueryClient()
  const [ingredientList, setIngredientList] = useState<{ required: string[]; optional: string[] }>({
    required: [],
    optional: []
  })
  const [specialInstructions, setSpecialInstructions] = useState<string>('')
  const [isAddCart, setIsAddCart] = useState<boolean>(false)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(1)
  //Fetch API to get food detail
  const getFoodDetail = useQuery({
    queryKey: ['food', chooseFood],
    queryFn: () => getIngredientOfFoodApi(chooseFood)
  })
  const addToCartMutation = useMutation({
    mutationFn: (data: ItemAddToCartType) => addItemToCartApi(data)
  })
  //END API

  const data = getFoodDetail.data?.data.metadata || null
  // console.log('DATA DETAIL FOOD', data)

  const handleConfirmAddToCart = () => {
    // console.log('Add to cart', ingredientList)
    // console.log('specialInstructions', specialInstructions)
    // console.log(ingredientList.required.map((item) => +item).concat(ingredientList.optional.map((item) => +item)))

    addToCartMutation.mutate(
      {
        foodId: chooseFood,
        quantity: quantity,
        specialInstructions: specialInstructions,
        ingredientIds: ingredientList.required.map((item) => +item).concat(ingredientList.optional.map((item) => +item))
      },
      {
        onSuccess: (res) => {
          if (res) {
            setOpenDetailFood(false)
            queryClient.invalidateQueries(['getCart'] as InvalidateQueryFilters)
            toast.success('Thêm vào giỏ hàng thành công')
          }
        },
        onError: (err) => {
          toast.error(err.message)
        }
      }
    )
  }

  const handleUpdateQuantity = (count: number) => {
    setQuantity((prev) => prev + count)
    setTotalPrice((prev) => prev + count * (prev / quantity))
  }

  useEffect(() => {
    if (data) {
      const isPickIngredient = data.ingredients.findIndex((item) => item.pick === true)
      if (isPickIngredient === -1) {
        setIsAddCart(true)
      } else {
        setIsAddCart(ingredientList.required.length !== 0)
      }
      if (ingredientList.required.length === 0 && ingredientList.optional.length === 0) {
        setTotalPrice(Number(data.price))
      }
    }
  }, [data, ingredientList])

  return (
    <>
      {data && (
        <div className='sm:w-[60vw] md:w-[32vw] bg-white min-h-[100vh] flex flex-col'>
          <div>
            <button className='px-4 pb-3' onClick={() => setOpenDetailFood(false)}>
              <CloseOutlinedIcon sx={{ fontSize: '26px' }} />
            </button>
          </div>
          <Divider />
          <div className='py-[28px] flex items-start gap-3 px-[20px]'>
            <div className='w-[100px] rounded overflow-hidden' style={{ aspectRatio: '1/1' }}>
              <img src={data.images[0]} className='w-full h-full object-cover' />
            </div>
            <div className='flex items-center justify-between flex-1'>
              <h4 className='text-[24px] text-black font-semibold'>{data.name}</h4>
              <div className='text-[26px] text-black font-semibold'>{formatPrice(+data.price)}đ</div>
            </div>
          </div>
          <div className='flex-1'>
            <div className='h-[5px] w-full bg-[#f7f7f7]'></div>
            {data.ingredients.map((item) => {
              return (
                <IngredientRequiredList
                  key={item.categoryIngredient}
                  ingredients={item}
                  setIngredientList={setIngredientList}
                  setTotalPrice={setTotalPrice}
                  quantity={quantity}
                />
              )
            })}

            <div className='h-[5px] w-full bg-[#f7f7f7]'></div>
            <div className='px-5 py-4'>
              <div>
                <span className='text-[18px] text-black font-semibold mr-2'>Special instructions</span>
                <span className='text-[16px] text-gray-500'>Lựa chọn</span>
              </div>
              <textarea
                className='w-full h-[100px] p-2 mt-2 rounded focus:ring-green-300 focus:ring-2'
                placeholder='Add special instructions'
                maxLength={130}
                style={{ maxHeight: '88px', overflowY: 'hidden' }}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className='w-full h-[100px] bg-white sticky bottom-0 left-0 right-0 flex items-center justify-evenly shadow-lg py-[50px]'>
            <button
              className='w-[40px] h-[40px] rounded flex items-center justify-center border border-gray-200'
              onClick={() => handleUpdateQuantity(-1)}
              disabled={quantity === 1}
            >
              <RemoveOutlinedIcon sx={{ fontSize: '35px', color: 'rgb(22 163 74 )' }} />
            </button>
            <span className='text-gray-600 text-[30px] font-medium'>{quantity}</span>
            <button
              className='w-[40px] h-[40px] rounded flex items-center justify-center border border-gray-200'
              onClick={() => handleUpdateQuantity(1)}
            >
              <AddOutlinedIcon sx={{ fontSize: '35px', color: 'rgb(22 163 74 )' }} />
            </button>
            <button
              className={`w-[60%] text-xl  ${!isAddCart ? 'bg-gray-200' : 'bg-green-400'} ${!isAddCart ? 'text-gray-800' : 'text-white'} text-center rounded py-3`}
              onClick={handleConfirmAddToCart}
              disabled={!isAddCart}
            >
              Add to cart - {formatPrice(totalPrice)}đ
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default FoodDetail
