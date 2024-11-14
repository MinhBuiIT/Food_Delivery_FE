export interface RestaurantType {
  id: number
  name: string
  description: string
  cuisineType: string
  isLikeUser: boolean
  address: {
    id: number
    numberStreet: string
    street: string
    ward: string
    district: string
    city: string
    postalCode: string
  }
  owner: string
  contactInfo: {
    mobile: string
    facebook: string
    instagram: string
    primary_email: string
  }
  openHours: string
  images: string[]
  createdAt: string
  open: boolean
  likes: number
}

export interface RestaurantFavoriteType {
  title: string
  imagesLiked: string[]
  description: string
  id: number
}
