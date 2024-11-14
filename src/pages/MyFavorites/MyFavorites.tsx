import { Container, Grid2 } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { getMyFavoriteRestaurantApi } from 'src/apis/restaurant.api'
import CardRestaurantFavor from 'src/components/CardRestaurantFavor'
import Spinner from 'src/components/Spinner'

const MyFavorites = () => {
  const getRestaurantFavoritesQuery = useQuery({
    queryKey: ['getRestaurantFavorites'],
    queryFn: () => getMyFavoriteRestaurantApi(),
    refetchOnMount: true
  })
  const restaurantFavorites = getRestaurantFavoritesQuery.data?.data.metadata || null
  console.log(getRestaurantFavoritesQuery.isFetching, getRestaurantFavoritesQuery.isLoading)

  return (
    <Container maxWidth='lg'>
      {!getRestaurantFavoritesQuery.isFetching ? (
        <>
          {restaurantFavorites && restaurantFavorites.length > 0 ? (
            <Grid2
              container
              spacing={4}
              sx={{ margin: '60px 0' }}
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {restaurantFavorites.map((res) => (
                <CardRestaurantFavor
                  title={res.title}
                  description={res.description}
                  id={res.id}
                  imagesLiked={res.imagesLiked}
                />
              ))}
            </Grid2>
          ) : (
            <div className='w-full h-full flex items-center justify-center my-[100px] text-center text-[16px] italic font-light'>
              Chưa có nhà hàng yêu thích
            </div>
          )}
        </>
      ) : (
        <div className='w-full h-full flex items-center justify-center my-[100px]'>
          <Spinner />
        </div>
      )}
    </Container>
  )
}

export default MyFavorites
