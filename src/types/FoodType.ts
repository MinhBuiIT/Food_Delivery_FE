import { CategoryIngredientType } from './CategoryIngredientType'
import { EventType } from './EventType'

export interface FoodWithCategoryType {
  category: string
  foods: FoodType[]
}
export interface FoodType {
  id: number
  name: string
  price: string
  description: string
  images: string[]
  available: boolean
  ingredientsNum: number
  event: EventType
}
export interface FoodDetailType {
  id: number
  name: string
  price: string
  description: string
  images: string[]
  ingredients: CategoryIngredientType[]
}
export interface FoodAdminType {
  id: number
  name: string
  description: string
  price: number
  vegetarian: boolean
  seasonal: boolean
  available: boolean
  disable: boolean
  createdAt: string
  images: string[]
  categoryFood: {
    id: number
    name: string
  }
}
