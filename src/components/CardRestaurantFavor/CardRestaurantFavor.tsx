import { Stack } from '@mui/material'
import { Link } from 'react-router-dom'
import { formatRestaurantName } from 'src/utils/helper'

interface CardRestaurantFavorProps {
  id: number
  title: string
  description: string
  imagesLiked: string[]
}

const CardRestaurantFavor = ({ id, title, description, imagesLiked }: CardRestaurantFavorProps) => {
  const formatName = formatRestaurantName(title)
  return (
    <div className='relative'>
      <Link to={`/detail/${formatName}/${id}`} className='relative'>
        <Stack
          direction={'column'}
          className='bg-white p-3 border border-gray-600 w-full rounded-lg hover:border-pri-dark hover:-translate-y-1 duration-200 min-h-[300px]'
        >
          <div className='w-full h-[160px] rounded-lg overflow-hidden'>
            <img src={imagesLiked[0]} alt={title} className='w-full h-full object-cover' />
          </div>
          <div className='my-2'>
            <h4 className='text-[24px] font-bold my-1 leading-7 line-clamp-1'>{title}</h4>
            <p className='text-[16px] text-gray-600 line-clamp-2 py-2'>{description}</p>
          </div>
          <hr className='w-full h-[2px] border-t-[2px] border-dashed border-pri-dark my-1' />
        </Stack>
      </Link>
    </div>
  )
}

export default CardRestaurantFavor
