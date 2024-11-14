import { Divider } from '@mui/material'
import { useState } from 'react'
import { CategoryIngredientType } from 'src/types/CategoryIngredientType'
import { IngredientItemType } from 'src/types/IngredientItem'
import { formatPrice } from 'src/utils/helper'

interface IngredientListProps {
  ingredients: CategoryIngredientType
  setIngredientList: React.Dispatch<
    React.SetStateAction<{
      required: string[]
      optional: string[]
    }>
  >
  setTotalPrice: React.Dispatch<React.SetStateAction<number>>
  quantity: number
}

const IngredientList = ({ ingredients, setIngredientList, setTotalPrice, quantity }: IngredientListProps) => {
  const ingredientItems = ingredients.ingredientItems
  const ingredientItemsSortByNames = ingredientItems.sort((a, b) => a.name.localeCompare(b.name))
  const [preRadioRequired, setPreRadioRequired] = useState<number>(0)

  const handleChooseIngredient = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: 'required' | 'optional',
    item: IngredientItemType
  ) => {
    if (key === 'optional') {
      if (e.target.checked) {
        setIngredientList((prev) => ({ ...prev, [key]: [...prev[key], e.target.value] }))
        setTotalPrice((prev) => prev + item.price * quantity)
      } else {
        setIngredientList((prev) => ({
          ...prev,
          [key]: prev[key].filter((i) => i !== e.target.value)
        }))
        setTotalPrice((prev) => prev - item.price * quantity)
      }
    } else {
      setPreRadioRequired(item.price)
      setIngredientList((prev) => ({ ...prev, [key]: [e.target.value] }))
      setTotalPrice((pre) => pre - preRadioRequired * quantity + item.price * quantity)
    }
  }

  return (
    <div className='px-5 py-4'>
      <div>
        <span className='text-xl font-semibold mr-1'>{ingredients.categoryIngredient}</span>
        <span className='text-sm text-gray-500'> {ingredients.pick ? 'Bắt Buộc' : 'Lựa Chọn'}</span>
      </div>
      <div className='my-[20px]'>
        {ingredients.pick
          ? ingredientItemsSortByNames.map((item) => {
              return (
                <label htmlFor={`radio-${ingredients.categoryIngredient}`} className='me-4 pb-3' key={item.id}>
                  <div className='flex items-center justify-between w-full pb-3'>
                    <div className='flex items-center'>
                      <input
                        id={`radio-${ingredients.categoryIngredient}`}
                        type='radio'
                        value={item.id}
                        name={`radio-${ingredients.categoryIngredient}`}
                        className='w-6 h-6 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500   focus:ring-2 '
                        onChange={(e) => handleChooseIngredient(e, 'required', item)}
                        disabled={!item.stock}
                      />
                      <span className='ms-2 text-[18px]'>{item.name}</span>
                      {!item.stock && (
                        <span className='bg-red-100 ml-3 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded   border border-red-400'>
                          Hết Hàng
                        </span>
                      )}
                    </div>
                    {item.price > 0 && <span className='text-[18px]'>{formatPrice(item.price)}</span>}
                  </div>
                  <Divider />
                </label>
              )
            })
          : ingredientItemsSortByNames.map((item) => {
              return (
                <label htmlFor={`checkbox-${ingredients.categoryIngredient}`} className='me-4 pb-3' key={item.id}>
                  <div className='flex items-center justify-between w-full pb-3'>
                    <div className='flex items-center'>
                      <input
                        id={`checkbox-${ingredients.categoryIngredient}`}
                        type='checkbox'
                        value={item.id}
                        name={`checkbox-${ingredients.categoryIngredient}`}
                        className='w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600  focus:ring-2 '
                        onChange={(e) => handleChooseIngredient(e, 'optional', item)}
                        disabled={!item.stock}
                      />
                      <span className='ms-2 text-[18px]'>{item.name}</span>
                      {!item.stock && (
                        <span className='bg-red-100 ml-3 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded   border border-red-400'>
                          Hết Hàng
                        </span>
                      )}
                    </div>
                    {item.price > 0 && <span className='text-[18px]'>{formatPrice(item.price)}</span>}
                  </div>
                  <Divider />
                </label>
              )
            })}
        {/* <label htmlFor='green-radio' className='me-4 pb-3'>
          <div className='flex items-center justify-between w-full pb-3'>
            <div className='flex items-center'>
              <input
                id='green-radio'
                type='radio'
                value=''
                name='colored-radio'
                className='w-6 h-6 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500   focus:ring-2 '
              />
              <span className='ms-2 text-[18px]'>Cấp 0</span>
            </div>
            <span className='text-[18px]'>14.000</span>
          </div>
          <Divider />
        </label> */}
      </div>
    </div>
  )
}

export default IngredientList
