export interface IngredientItemType {
  id: number
  name: string
  price: number
  stock: boolean
}
export interface IngredientItemWithCategoryType extends IngredientItemType {
  categoryIngredient: {
    name: string
    pick: boolean
  }
}
