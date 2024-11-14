import { Container, Grid2, Stack } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Link, useLocation } from 'react-router-dom'
import { getAllRestaurantsApi, getTotalPageRestaurantsApi } from 'src/apis/restaurant.api'
import Button from 'src/components/Button/Button'
import CartRestaurant from 'src/components/CardRestaurant'
import { foodPopular } from 'src/constants/common'
import { containerVariants, itemVariants } from 'src/constants/variants'
import deliveryManImg from '../../assets/delivery-man.png'
import food1 from '../../assets/food-1.png'
import food2 from '../../assets/food-2.png'
import food3 from '../../assets/food-3.png'
import offerImg from '../../assets/offer.png'
import orderImg from '../../assets/order-food.png'

const Home = () => {
  const location = useLocation()
  const stateNav = location.state as { pleaseLogin: boolean }

  const getTotalPageResQuery = useQuery({
    queryKey: ['getTotalPageResHome'],
    queryFn: () => getTotalPageRestaurantsApi({ page: 1, limit: 4 })
  })
  const totalPage = getTotalPageResQuery.data?.data.metadata || 0
  const randomPage = Math.floor(Math.random() * totalPage) + 1
  const getAllResQuery = useQuery({
    queryKey: ['getAllResHome', totalPage],
    queryFn: () => getAllRestaurantsApi({ page: randomPage == totalPage ? 1 : randomPage, limit: 4 })
  })
  const restaurantList = getAllResQuery.data?.data.metadata.content || []
  useEffect(() => {
    if (stateNav?.pleaseLogin === true) {
      toast('Vui lòng đăng nhập', {
        icon: '🔒'
      })
      stateNav.pleaseLogin = false
    }
  }, [])

  return (
    <div>
      <div className='bg-pri h-[100vh]'>
        <Container maxWidth='lg'>
          <Stack
            direction={'row'}
            height={'500px'}
            alignItems={'center'}
            justifyContent={'space-between'}
            sx={{ position: 'relative' }}
          >
            <div className='w-[80px] h-[80px] rounded-full bg-pri-dark absolute left-[-150px] bottom-8'></div>
            <Stack direction={'column'} width={'50%'}>
              <motion.h3
                className='text-black font-bold text-[50px]'
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
              >
                Giao Hàng Siêu Tốc
              </motion.h3>
              <motion.h3
                className='text-black font-bold text-[50px]'
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.1 }}
              >
                Đến Tận <span className='text-pri-text'>Nơi</span>
              </motion.h3>
              <motion.p
                className='text-base'
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                Thưởng thức món ăn yêu thích của bạn với dịch vụ giao hàng nhanh chóng và tiện lợi.<br></br> Đặt hàng
                ngay để trải nghiệm sự khác biệt!
              </motion.p>
              <Button content='Đặt Ngay' />
            </Stack>
            <div className='relative w-[50%] h-full'>
              <div className='w-[40px] h-[40px] rounded-full bg-pri-dark'></div>
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -180, x: '-50%' }}
                animate={{ opacity: 1, scale: 1, rotate: 0, x: '-50%' }}
                transition={{ duration: 1 }}
                className='w-[300px] absolute top-2 left-1/2 -translate-x-1/2'
              >
                <img src={food1} alt='Food' className='w-full h-full object-cover' />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: 180, y: '-50%' }}
                animate={{ opacity: 1, scale: 1, rotate: 0, y: '-50%' }}
                transition={{ duration: 1 }}
                className='w-[200px] absolute top-2/3 -translate-y-1/2 left-0'
              >
                <img src={food2} alt='Food' className='w-full h-full object-cover' />
              </motion.div>
              <div className='w-[60px] h-[60px] rounded-full bg-pri-dark absolute right-0 top-1/3'></div>
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: 180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1 }}
                className='w-[150px] absolute bottom-3 right-0'
              >
                <img src={food3} alt='Food' className='w-full h-full object-cover' />
              </motion.div>
              <div className='w-[20px] h-[20px] rounded-full bg-pri-dark absolute left-1/2 -translate-x-1/2 bottom-8'></div>
            </div>
          </Stack>
        </Container>
      </div>
      <Container maxWidth='lg'>
        <div className='py-[80px]'>
          <div className='text-center'>
            <motion.h4
              className='text-2xl font-semibold text-pri-text'
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              How it works
            </motion.h4>
            <motion.h3
              className='text-[45px] font-bold my-1'
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              Dịch vụ của chúng tôi
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className='text-[18px] max-w-[50%] text-center mx-auto'
            >
              Sản phẩm của chúng tôi luôn được ưu tiên hàng đầu về chất lượng, đảm bảo sự tươi ngon và an toàn cho đến
              khi tới tay bạn.
            </motion.p>
          </div>
          <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ margin: '60px 0' }}>
            <Stack direction={'column'} alignItems={'center'}>
              <motion.img
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                src={orderImg}
                alt='Order'
                className='w-[180px]'
              />
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className='text-black text-[30px] font-bold my-1'
              >
                Dễ Dàng Đặt Hàng
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className='text-[18px] text-gray-600 max-w-[80%] text-center'
              >
                Chỉ cần một vài thao tác trên ứng dụng, món ăn yêu thích của bạn sẽ sẵn sàng được giao đến.
              </motion.div>
            </Stack>
            <Stack direction={'column'} alignItems={'center'}>
              <motion.img
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                src={deliveryManImg}
                alt='Delivery Man'
                className='w-[180px]'
              />
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className='text-black text-[30px] font-bold my-1'
              >
                Giao Hàng Siêu Tốc
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className='text-[18px] text-gray-600 max-w-[80%] text-center'
              >
                Chúng tôi cam kết giao hàng đúng giờ, đảm bảo bạn không phải chờ đợi lâu.
              </motion.div>
            </Stack>
            <Stack direction={'column'} alignItems={'center'}>
              <motion.img
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                src={offerImg}
                alt='Quanlity Service'
                className='w-[180px]'
              />
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className='text-black text-[30px] font-bold my-1'
              >
                Dễ Dàng Đặt Hàng
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className='text-[18px] text-gray-600 max-w-[80%] text-center'
              >
                Thực phẩm chất lượng cao nhất, luôn tươi ngon và an toàn cho sức khỏe của bạn.
              </motion.div>
            </Stack>
          </Stack>
        </div>
        <div className='py-[80px]'>
          <div className='text-center'>
            <motion.h4
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className='text-2xl font-semibold text-pri-text'
            >
              Restaurants
            </motion.h4>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className='text-[45px] font-bold my-1'
            >
              Các nhà hàng trong thành phố
            </motion.h3>
          </div>

          <Grid2
            variants={containerVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            component={motion.div}
            container
            spacing={4}
            sx={{ marginTop: '30px' }}
          >
            {restaurantList.length > 0 &&
              restaurantList.map((restaurant) => {
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

            <div className='flex items-center justify-center w-full'>
              <Link
                to={'/restaurant'}
                className='bg-pri-btn text-dark px-6 py-2 rounded-lg mt-4 inline-block w-fit font-semibold hover:translate-y-1 hover:scale-105 duration-200'
              >
                Xem Thêm
              </Link>
            </div>
          </Grid2>
        </div>
        <div className='my-[80px]'>
          <div className='text-center'>
            <motion.h4
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className='text-2xl font-semibold text-pri-text'
            >
              Popular Foods
            </motion.h4>
            <motion.h3
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className='text-[45px] font-bold my-1'
            >
              Các món ăn phổ biến
            </motion.h3>
          </div>

          <Grid2
            container
            spacing={4}
            className='mt-[40px]'
            variants={containerVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            component={motion.div}
          >
            {foodPopular.map((food, index) => {
              return (
                <Grid2 component={motion.div} variants={itemVariants} key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                  <div className='relative'>
                    <img src={food.img} alt='Food' className='w-full h-[200px] object-cover rounded-lg' />
                    <div className='absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2 rounded-b-lg'>
                      {food.name}
                    </div>
                  </div>
                </Grid2>
              )
            })}
          </Grid2>
        </div>
      </Container>
    </div>
  )
}

export default Home
