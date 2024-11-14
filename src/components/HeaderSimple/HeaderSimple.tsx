import TurnLeftIcon from '@mui/icons-material/TurnLeft'
import { Container, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Logo from '../Logo'

const HeaderSimple = () => {
  const navigate = useNavigate()
  return (
    <div className='bg-pri py-[20px]'>
      <Container maxWidth='lg'>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Logo />

          <button onClick={() => navigate(-1)} className='text-[18px]'>
            <TurnLeftIcon sx={{ fontSize: '40px' }} />
          </button>
        </Stack>
      </Container>
    </div>
  )
}

export default HeaderSimple
