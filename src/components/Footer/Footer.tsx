import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import XIcon from '@mui/icons-material/X'
import { Container, Grid2, Stack } from '@mui/material'
import ramenImg from '../../assets/ramen.png'
import Logo from '../Logo'

const Footer = () => {
  return (
    <div className='bg-pri min-h-[30vh] w-full py-[40px] relative'>
      <div className='w-[80px] h-[80px] rounded-full bg-pri-dark absolute left-0 bottom-8' />
      <div className='w-[50px] h-[50px] rounded-full bg-pri-dark absolute right-4 top-8' />
      <div className='w-[30px] h-[30px] rounded-full bg-pri-dark absolute right-1/2 top-8' />
      <Container maxWidth='lg'>
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Stack direction={'row'} spacing={2} alignItems={'center'}>
              <Logo />
              <img src={ramenImg} alt='ramen' className='w-[40px]' />
            </Stack>
            <Stack direction={'row'} className='mt-[20px]' spacing={3}>
              <button className='w-[40px] h-[40px] shadow rounded-full bg-white flex items-center justify-center text-black hover:shadow-lg hover:bg-pri-btn hover:text-white duration-200'>
                <InstagramIcon />
              </button>
              <button className='w-[40px] h-[40px] shadow rounded-full bg-white flex items-center justify-center text-black hover:shadow-lg hover:bg-pri-btn hover:text-white duration-200'>
                <FacebookIcon />
              </button>
              <button className='w-[40px] h-[40px] shadow rounded-full bg-white flex items-center justify-center text-black hover:shadow-lg hover:bg-pri-btn hover:text-white duration-200'>
                <XIcon />
              </button>
            </Stack>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <h3 className='text-black font-bold text-[24px]'>Công Ty</h3>
            <Stack direction={'column'} spacing={1} className='text-gray-600 text-[18px] mt-4 font-semibold'>
              <a href='#'>Giới thiệu</a>
              <a href='#'>Liên hệ</a>
              <a href='#'>Điều khoản</a>
              <a href='#'>Chính sách</a>
            </Stack>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <h3 className='text-black font-bold text-[24px]'>Chính Sách</h3>
            <Stack direction={'column'} spacing={1} className='text-gray-600 text-[18px] mt-4 font-semibold'>
              <a href='#'>FAQ</a>
              <a href='#'>Privacy</a>
              <a href='#'>Shipping</a>
            </Stack>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <h3 className='text-black font-bold text-[24px]'>Liên Hệ</h3>
            <Stack direction={'column'} spacing={1} className='text-gray-600 text-[18px] mt-4 font-semibold'>
              <span>+84 1234 5678 90</span>
              <span>eatfast@gmail.com</span>
            </Stack>
          </Grid2>
        </Grid2>
        <hr className='my-[30px]' />
        <p className='font-bold text-[20px] text-gray-600 text-center'>{new Date().getFullYear()} EatFast.</p>
      </Container>
    </div>
  )
}

export default Footer
