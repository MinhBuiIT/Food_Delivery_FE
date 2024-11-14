import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { Box, Container, Drawer, Modal, Popover, Stack } from '@mui/material'
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { logoutApi } from 'src/apis/auth.api'
import { getAllItemInCartApi } from 'src/apis/cart.api'
import { MyAppAuthContext } from 'src/context/AppAuthContext'
import { MyAppModalContext } from 'src/context/AppModalContext'
import { handleNameUser } from 'src/utils/helper'
import CartDetail from '../CartDetail'
import Logo from '../Logo'
import ModalAuth from '../ModalAuth'

const Header = () => {
  const queryClient = useQueryClient()
  const { authModal, setAuthModal } = useContext(MyAppModalContext)
  const { isAuth, profile, setIsAuth, setProfile } = useContext(MyAppAuthContext)
  const [isSearch, setIsSearch] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [openDetailCart, setOpenDetailCart] = useState<boolean>(false)
  const navigate = useNavigate()
  const location = useLocation()

  const isHome = location.pathname === '/'
  //const isRestaurant = location.pathname.includes('/restaurant')

  //API
  const logoutMutation = useMutation({
    mutationFn: () => logoutApi()
  })
  const getCartQuery = useQuery({
    queryKey: ['getCart'],
    queryFn: () => getAllItemInCartApi(),
    enabled: isAuth
  })
  const cartData = getCartQuery.data?.data.metadata || null
  const totalPriceCart = cartData ? cartData.totalPrice : 0
  const totalItemCart = cartData ? cartData.items.reduce((a, b) => a + b.quantity, 0) : 0
  //END API
  const variants = {
    open: { width: '30%' },
    closed: { width: '0' }
  }
  const handleClose = () => setAuthModal(false)
  const handleOpen = () => setAuthModal(true)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      setAnchorEl(null)
      setIsAuth(false)
      setProfile(null)
      queryClient.removeQueries(['getCart'] as InvalidateQueryFilters)
      navigate('/')
      toast.success('Đăng xuất thành công')
    } catch (error) {
      console.log(error)

      toast.error('Đăng xuất thất bại')
    }
  }
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenDetailCart(newOpen)
  }
  return (
    <div className='bg-pri py-[20px] fixed top-0 left-0 right-0 z-[100]'>
      <Container maxWidth='lg'>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Logo />
          <Stack
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            direction={'row'}
            gap={'20px'}
            alignItems={'center'}
            sx={{ flexShrink: 0, flexGrow: 1 }}
            justifyContent={'flex-end'}
          >
            <motion.div
              variants={variants}
              animate={isSearch ? 'open' : 'closed'}
              transition={{ duration: 0.5 }}
              className={`relative`}
              onMouseLeave={() => {
                setIsSearch(false)
              }}
            >
              {isHome && (
                <>
                  <button
                    className={`${!isSearch ? 'hover:bg-white' : ''} duration-200 w-[40px] h-[40px] rounded-full absolute right-0 top-1/2 -translate-y-1/2`}
                    onMouseEnter={() => setIsSearch(true)}
                  >
                    <SearchOutlinedIcon sx={{ fontSize: '24px' }} />
                  </button>
                  {isSearch && (
                    <input
                      type='text'
                      placeholder='Tìm kiếm'
                      className={`w-full ${isSearch ? 'h-[40px] pl-[40px] pr-[40px] border-[1px]' : ''}   rounded-full  border-gray-300`}
                    />
                  )}
                </>
              )}
            </motion.div>
            <button
              className={`px-3 h-[40px]  flex items-center justify-center border-[1px] border-gray-300 rounded  relative ${totalPriceCart > 0 && 'bg-pri-dark'}`}
              onClick={toggleDrawer(true)}
            >
              <LocalMallOutlinedIcon sx={{ fontSize: '20px', color: `${totalPriceCart > 0 ? 'white' : 'black'}` }} />
              {totalItemCart > 0 && (
                <div className='absolute top-[-10px] left-[-10px] w-[24px] h-[24px] rounded-full bg-white text-black flex items-center justify-center border border-pri-dark'>
                  {totalItemCart}
                </div>
              )}
            </button>
            {isAuth ? (
              <>
                <button
                  className='w-[40px] h-[40px] border border-white bg-[rgba(0,0,0,0.15)] text-white text-base flex items-center justify-center font-medium rounded-full'
                  onClick={handleClick}
                >
                  {handleNameUser(profile?.fullName as string)}
                </button>
                <Popover
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={() => setAnchorEl(null)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                >
                  <div className='py-4 flex flex-col gap-3'>
                    <button className='text-lg  hover:text-pri-dark text-left px-3' onClick={handleLogout}>
                      Đăng xuất
                    </button>
                  </div>
                  <div className='py-4 flex flex-col gap-3'>
                    <Link to={'/my-order'} className='text-lg  hover:text-pri-dark text-left px-3'>
                      Đơn hàng của tôi
                    </Link>
                  </div>
                  <div className='py-4 flex flex-col gap-3'>
                    <Link to={'/my-favorites'} className='text-lg  hover:text-pri-dark text-left px-3'>
                      Nhà hàng yêu thích
                    </Link>
                  </div>
                </Popover>
              </>
            ) : (
              <button
                className='px-[6px] h-[40px]  flex items-center justify-center border-[1px] border-gray-300 rounded text-sm text-gray-600'
                onClick={handleOpen}
              >
                Login/Sign Up
              </button>
            )}
          </Stack>
        </Stack>
        {/* {isRestaurant && (
          <form className='mt-4 w-full relative'>
            <input
              type='text'
              placeholder='Tìm kiếm'
              className='w-full h-[40px] pl-[40px] pr-[40px] border-[1px] rounded-full outline-none border-gray-300'
            />
            <button className='w-[40px] h-[40px] rounded-full absolute left-0 top-1/2 -translate-y-1/2'>
              <SearchOutlinedIcon sx={{ fontSize: '24px' }} />
            </button>
          </form>
        )} */}

        <Modal
          open={authModal}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box>
            <ModalAuth />
          </Box>
        </Modal>
        {/* <Stack
          direction={'row'}
          height={'500px'}
          alignItems={'center'}
          justifyContent={'space-between'}
          sx={{ position: 'relative' }}
        >
          <div className='w-[80px] h-[80px] rounded-full bg-pri-dark absolute left-[-150px] bottom-8'></div>
          <Stack direction={'column'} width={'50%'}>
            <h3 className='text-black font-bold text-[50px]'>Giao Hàng Siêu Tốc</h3>
            <h3 className='text-black font-bold text-[50px]'>
              Đến Tận <span className='text-pri-text'>Nơi</span>
            </h3>
            <p className='text-base'>
              Thưởng thức món ăn yêu thích của bạn với dịch vụ giao hàng nhanh chóng và tiện lợi.<br></br> Đặt hàng ngay
              để trải nghiệm sự khác biệt!
            </p>
            <button className='bg-pri-btn text-dark px-6 py-2 rounded-lg mt-4 inline-block w-fit font-semibold hover:translate-y-1 hover:scale-105 duration-200'>
              Đặt Ngay
            </button>
          </Stack>
          <div className='relative w-[50%] h-full'>
            <div className='w-[40px] h-[40px] rounded-full bg-pri-dark'></div>
            <div className='w-[300px] absolute top-2 left-1/2 -translate-x-1/2'>
              <img src={food1} alt='Food' className='w-full h-full object-cover' />
            </div>
            <div className='w-[200px] absolute top-2/3 -translate-y-1/2 left-0'>
              <img src={food2} alt='Food' className='w-full h-full object-cover' />
            </div>
            <div className='w-[60px] h-[60px] rounded-full bg-pri-dark absolute right-0 top-1/3'></div>
            <div className='w-[150px] absolute bottom-3 right-0'>
              <img src={food3} alt='Food' className='w-full h-full object-cover' />
            </div>
            <div className='w-[20px] h-[20px] rounded-full bg-pri-dark absolute left-1/2 -translate-x-1/2 bottom-8'></div>
          </div>
        </Stack> */}
      </Container>
      <Drawer open={openDetailCart} onClose={toggleDrawer(false)} anchor='right'>
        <CartDetail cartData={cartData} setOpenDetailCart={setOpenDetailCart} />
      </Drawer>
    </div>
  )
}

export default Header
