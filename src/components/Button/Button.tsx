import { motion } from 'framer-motion'
import { MouseEventHandler } from 'react'

const Button = ({ content, handClick }: { content: string; handClick?: MouseEventHandler | undefined }) => {
  return (
    <motion.button
      onClick={handClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className='bg-pri-btn text-dark px-6 py-2 rounded-lg mt-4 inline-block w-fit font-semibold hover:translate-y-1 hover:scale-105 duration-200'
    >
      {content}
    </motion.button>
  )
}

export default Button
