import { Container, Tab, Tabs } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getAllFoodOfResApi } from 'src/apis/food.api'
import { getRestaurantByIdApi } from 'src/apis/restaurant.api'
import CategoryFood from 'src/components/CategoryFood'
import { handleTimeOpening } from 'src/utils/helper'

const RestaurantDetail = () => {
  const [valueTagCate, setValueTagCate] = useState(0)
  const [isOpeningTime, setIsOpeningTime] = useState(false)
  const params = useParams<{ name: string; id: string }>()

  //API
  const getRestaurantDetailQuery = useQuery({
    queryKey: ['getRestaurantDetail', params.id],
    queryFn: () => getRestaurantByIdApi(Number(params.id)),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5
  })

  const getFoodWithCategoryQuery = useQuery({
    queryKey: ['getFoodWithCategory', params.id],
    queryFn: () => getAllFoodOfResApi(Number(params.id))
  })
  //END API
  const restaurantDetailData = getRestaurantDetailQuery.data?.data.metadata
  const foodWithCategoryData = useMemo(
    () =>
      getFoodWithCategoryQuery.data
        ? getFoodWithCategoryQuery.data.data.metadata.sort((a, b) => a.category.localeCompare(b.category))
        : [],
    [getFoodWithCategoryQuery.data]
  )
  const categoryFoodData =
    foodWithCategoryData.length > 0 ? foodWithCategoryData.map((f) => ({ name: f.category })) : []

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValueTagCate(newValue)
    document.getElementById(`category-${newValue}`)?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (restaurantDetailData?.openHours) {
      const betweenTimeOpen = handleTimeOpening(restaurantDetailData?.openHours || '')
      // console.log(betweenTimeOpen)

      if (betweenTimeOpen) {
        const isCheckOpening =
          betweenTimeOpen.openTime <= new Date().getHours() && betweenTimeOpen.closeTime >= new Date().getHours()
        setIsOpeningTime(isCheckOpening)
      }
    }
  }, [restaurantDetailData?.openHours])

  return (
    <div>
      <div className='shadow pt-[40px] '>
        <Container maxWidth='lg'>
          <div className=' bg-white pb-[40px]'>
            <h1 className='text-4xl font-bold'>{restaurantDetailData?.name}</h1>
            <div className='text-base text-gray-500 mt-2'>Cuisine: {restaurantDetailData?.cuisineType}</div>
            <div className='flex items-center gap-3'>
              <div className='text-base text-gray-600 mt-2'>Opening Hours: {restaurantDetailData?.openHours}</div>
              {restaurantDetailData?.open ? (
                <span className='bg-green-500 text-white px-2 py-1 rounded'>Opening</span>
              ) : (
                <span className='bg-red-500 text-white px-2 py-1 rounded'>Closed</span>
              )}
            </div>
            <div className='text-base text-gray-600 mt-2'>
              Address:{' '}
              {`${restaurantDetailData?.address.numberStreet} ${restaurantDetailData?.address.street}, ${restaurantDetailData?.address.ward}, ${restaurantDetailData?.address.district}, ${restaurantDetailData?.address.city}`}
            </div>
          </div>
          <Tabs
            value={valueTagCate}
            onChange={handleChange}
            variant='scrollable'
            scrollButtons
            aria-label='scrollable auto tabs example'
          >
            {categoryFoodData.length > 0 &&
              categoryFoodData.map((cate) => {
                return <Tab label={cate.name} key={cate.name} />
              })}
          </Tabs>
        </Container>
      </div>
      <div className='w-full pt-[100px] bg-[#f7f7f7] relative'>
        {(!restaurantDetailData?.open || !isOpeningTime) && (
          <div className='absolute top-0 left-0 w-full bottom-0 z-50 bg-white opacity-25'></div>
        )}

        <Container maxWidth='lg'>
          {foodWithCategoryData.length > 0 &&
            foodWithCategoryData.map((f, index) => {
              return <CategoryFood key={f.category} foodInfo={f} index={index} />
            })}
        </Container>
      </div>
    </div>
  )
}

export default RestaurantDetail
