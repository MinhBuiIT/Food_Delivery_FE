import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Stack } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { changeLikeRestaurantApi } from 'src/apis/restaurant.api'
import { MyAppAuthContext } from 'src/context/AppAuthContext'
import { formatRestaurantName } from 'src/utils/helper'

interface CardRestaurantProps {
  imgLink: string
  name: string
  description: string
  location: string
  isLike: boolean
  uid: number
}

const CardRestaurant = ({ imgLink, name, description, location, isLike, uid }: CardRestaurantProps) => {
  const { isAuth } = useContext(MyAppAuthContext)
  const [like, setLike] = useState<boolean>(isLike || false)
  const changeLikeRestaurantMutation = useMutation({
    mutationFn: (id: number) => changeLikeRestaurantApi(id)
  })
  const handleLikeRestaurant = () => {
    changeLikeRestaurantMutation.mutate(uid, {
      onSuccess: () => {
        setLike(!like)
      },
      onError: () => {
        toast.error('Failed to like restaurant')
      }
    })

    setLike(!like)
  }
  // console.log('uid - like', uid, like)

  const formatName = formatRestaurantName(name)
  return (
    <div className='relative'>
      <Link to={`/detail/${formatName}/${uid}`} className='relative'>
        <Stack
          direction={'column'}
          className='bg-white p-3 border border-gray-600 w-full rounded-lg hover:border-pri-dark hover:-translate-y-1 duration-200 min-h-[300px]'
        >
          <div className='w-full h-[160px] rounded-lg overflow-hidden'>
            <img src={imgLink} alt={name} className='w-full h-full object-cover' />
          </div>
          <div className='my-2'>
            <h4 className='text-[24px] font-bold my-1 leading-7 line-clamp-1'>{name}</h4>
            <p className='text-[16px] text-gray-600 line-clamp-2 py-2'>{description}</p>
          </div>
          <hr className='w-full h-[2px] border-t-[2px] border-dashed border-pri-dark my-1' />
          <div className='mt-2 flex items-center justify-between w-[90%]'>
            <div>
              <p className='line-clamp-2 max-w-full'>
                <span className='text-pri-text font-bold'>Location: </span>
                {location}
              </p>
            </div>
          </div>
        </Stack>
      </Link>
      {isAuth && (
        <button onClick={handleLikeRestaurant} className='absolute bottom-5 right-[12px] z-10'>
          {like ? <FavoriteIcon sx={{ color: 'red' }} /> : <FavoriteBorderIcon />}
        </button>
      )}
    </div>
  )
}

export default CardRestaurant
