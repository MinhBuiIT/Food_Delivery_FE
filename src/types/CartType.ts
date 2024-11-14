import { EventType } from './EventType'
import { FoodType } from './FoodType'
import { IngredientItemWithCategoryType } from './IngredientItem'

export interface CartType {
  id: number
  totalPrice: number
  items: CartItemType[]
  restaurantId: number
}
export interface CartItemType {
  id: number
  food: Omit<FoodType, 'ingredientsNum'>
  quantity: number
  specialInstructions: string
  totalPrice: number
  ingredients: IngredientItemWithCategoryType[]
  event: EventType
}
