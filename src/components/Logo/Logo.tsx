import { Box } from '@mui/material'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Link to='/'>
        <h3 className='text-black font-semibold text-[34px] ' style={{ fontFamily: 'Crimson Text' }}>
          <span className='font-normal mr-1' style={{ fontFamily: 'Pacifico' }}>
            E
          </span>
          at
          <span className='font-normal' style={{ fontFamily: 'Pacifico' }}>
            F
          </span>
          ast
        </h3>
      </Link>
    </Box>
  )
}

export default Logo
