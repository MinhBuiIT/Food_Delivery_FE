import { Grid2 } from '@mui/material'
import { useMemo } from 'react'
import { FoodWithCategoryType } from 'src/types/FoodType'
import FoodItem from '../FoodItem'

interface CategoryFoodProps {
  foodInfo: FoodWithCategoryType
  index: number
}
const CategoryFood = ({ foodInfo, index }: CategoryFoodProps) => {
  const foods = useMemo(() => foodInfo.foods.sort((a, b) => a.name.localeCompare(b.name)), [foodInfo.foods])
  return (
    <div className='pb-[24px]' id={`category-${index}`}>
      <h3 className='capitalize text-black text-[40px] font-bold mb-6'>{foodInfo.category}</h3>
      <Grid2 container spacing={4}>
        {foods.length > 0 ? (
          foods.map((food) => {
            return (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={food.id}>
                <FoodItem food={food} />
              </Grid2>
            )
          })
        ) : (
          <Grid2 size={{ xs: 12 }}>
            <p className='text-gray-800 italic text-[18px] text-center'>No Food</p>
          </Grid2>
        )}
      </Grid2>
    </div>
  )
}

export default CategoryFood
