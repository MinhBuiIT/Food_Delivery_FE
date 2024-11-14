import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { Container, Grid2 } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { getAllRestaurantsApi, searchRestaurantApi } from 'src/apis/restaurant.api'
import Button from 'src/components/Button/Button'
import CartRestaurant from 'src/components/CardRestaurant'
import { RestaurantType } from 'src/types/RestaurantType'

const Restaurant = () => {
  const [pagination, setPagination] = useState({ page: 1, limit: 8 })
  const [allRes, setAllRes] = useState<RestaurantType[]>([])
  const [searchText, setSearchText] = useState<string>('')
  const [isSearch, setIsSearch] = useState<boolean>(false)

  const getAllResQuery = useQuery({
    queryKey: ['getAllRes', pagination.page, pagination.limit],
    queryFn: () => getAllRestaurantsApi({ page: pagination.page, limit: pagination.limit })
  })

  const searchResQuery = useQuery({
    queryKey: ['searchRes', searchText],
    queryFn: () => searchRestaurantApi(searchText),
    enabled: isSearch
  })

  const handleLoadMoreRestaurant = () => {
    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
  }

  const restaurantList = useMemo(() => getAllResQuery.data?.data.metadata.content || [], [getAllResQuery.data])
  const { currentPage, totalPages } = getAllResQuery.data
    ? getAllResQuery.data.data.metadata
    : { currentPage: 0, totalPages: 0 }
  const notMoreData = currentPage === totalPages
  useEffect(() => {
    if (restaurantList.length > 0) {
      setAllRes((prev) => {
        return [...prev, ...restaurantList]
      })
    }
  }, [restaurantList])

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setIsSearch(false)
    }
    setSearchText(e.target.value)
  }
  const handleSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSearch(true)
  }
  const searchRes = useMemo(() => searchResQuery.data?.data.metadata || [], [searchResQuery.data])
  return (
    <div>
      <div className='bg-pri pt-[5px] pb-[15px]'>
        <Container maxWidth='lg'>
          <form className='mt-4 w-full relative' onSubmit={handleSubmitSearch}>
            <input
              type='text'
              placeholder='Tìm kiếm'
              className='w-full h-[40px] pl-[40px] pr-[40px] border-[1px] rounded-full outline-none border-gray-300'
              value={searchText}
              onChange={handleChangeSearch}
            />
            <button className='w-[40px] h-[40px] rounded-full absolute left-0 top-1/2 -translate-y-1/2'>
              <SearchOutlinedIcon sx={{ fontSize: '24px' }} />
            </button>
          </form>
        </Container>
      </div>
      <Container maxWidth='lg'>
        <Grid2
          container
          spacing={4}
          sx={{ margin: '60px 0' }}
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {!isSearch
            ? allRes.length > 0 &&
              allRes.map((restaurant, index) => {
                return (
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                    <CartRestaurant
                      name={restaurant.name}
                      imgLink={restaurant.images[0]}
                      description={restaurant.description}
                      location={`${restaurant.address.numberStreet} ${restaurant.address.street}, ${restaurant.address.ward}, ${restaurant.address.district}, ${restaurant.address.city}`}
                      isLike={restaurant.isLikeUser}
                      uid={restaurant.id}
                    />
                  </Grid2>
                )
              })
            : searchRes.length > 0 &&
              searchRes.map((restaurant) => {
                return (
                  <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={restaurant.id}>
                    <CartRestaurant
                      name={restaurant.name}
                      imgLink={restaurant.images[0]}
                      description={restaurant.description}
                      location={`${restaurant.address.numberStreet} ${restaurant.address.street}, ${restaurant.address.ward}, ${restaurant.address.district}, ${restaurant.address.city}`}
                      isLike={restaurant.isLikeUser}
                      uid={restaurant.id}
                    />
                  </Grid2>
                )
              })}
        </Grid2>
        {getAllResQuery.isFetching && (
          <div role='status' className='text-center'>
            <svg
              aria-hidden='true'
              className='inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-300 fill-yellow-400'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentFill'
              />
            </svg>
            <span className='sr-only'>Loading...</span>
          </div>
        )}
        {!notMoreData && (
          <div className='text-center mb-[60px]'>
            <Button content='Xem Thêm' handClick={handleLoadMoreRestaurant} />
          </div>
        )}
      </Container>
    </div>
  )
}

export default Restaurant
