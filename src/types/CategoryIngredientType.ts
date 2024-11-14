import { IngredientItemType } from './IngredientItem'

export interface CategoryIngredientType {
  categoryIngredient: string
  pick: boolean
  ingredientItems: IngredientItemType[]
}
