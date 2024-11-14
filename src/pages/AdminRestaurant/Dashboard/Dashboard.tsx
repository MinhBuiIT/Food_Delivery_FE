import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded'
import InstagramIcon from '@mui/icons-material/Instagram'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import { changeStatusRestaurantApi, getRestaurantByOwnerApi } from 'src/apis/AdminRes/adminres.api'
import { MyAppAuthContext } from 'src/context/AppAuthContext'
import { setItem } from 'src/utils/localStorage'

const Dashboard = () => {
  const { setRestaurantId } = useContext(MyAppAuthContext)
  const toastRef = useRef<boolean>(false)
  const { state } = useLocation()
  const navigate = useNavigate()
  const [isOpenRestaurant, setIsOpenRestaurant] = useState<boolean>(false)

  const getRestaurantInfoQuery = useQuery({
    queryKey: ['restaurant-info'],
    queryFn: () => getRestaurantByOwnerApi()
  })
  const changeStatusRestaurantMutation = useMutation({
    mutationFn: (id: number) => changeStatusRestaurantApi(id)
  })

  const restaurantInfo = getRestaurantInfoQuery.data?.data.metadata || null
  useEffect(() => {
    if (getRestaurantInfoQuery.isError) {
      navigate('/admin/restaurant/create', {
        state: { pleaseCreateRestaurant: true }
      })
    }
  }, [getRestaurantInfoQuery.isError])
  useEffect(() => {
    if (state && state.createdRestaurant && !toastRef.current) {
      toastRef.current = true
      toast('Đã nhập thông tin của nhà hàng', {
        position: 'top-center'
      })
    }
  }, [state])
  useEffect(() => {
    if (restaurantInfo) {
      setRestaurantId(restaurantInfo.id)
      setItem('restaurantId', restaurantInfo.id)
      setIsOpenRestaurant(restaurantInfo.open)
    }
  }, [restaurantInfo])

  const handleChangeStatusRestaurant = (id: number) => {
    changeStatusRestaurantMutation.mutate(id, {
      onSuccess: (res) => {
        setIsOpenRestaurant(res.data.metadata.open)
      }
    })
  }
  return (
    <div>
      {restaurantInfo && (
        <>
          <div className='flex items-center gap-4 justify-center'>
            <h1 className='capitalize text-[48px] text-black font-semibold py-[20px] text-center'>
              {restaurantInfo.name}
            </h1>
            {!isOpenRestaurant ? (
              <button
                type='button'
                className='text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-[18px] px-5 py-2 text-center  '
                onClick={() => handleChangeStatusRestaurant(restaurantInfo.id)}
              >
                Open
              </button>
            ) : (
              <button
                type='button'
                className='text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 '
                onClick={() => handleChangeStatusRestaurant(restaurantInfo.id)}
              >
                Close
              </button>
            )}
          </div>
          <div className='p-4 border-2 border-gray-200 border-dashed rounded-lg bg-slate-50'>
            <h5 className='text-[24px] font-semibold pb-[16px]'>Thông tin nhà hàng</h5>
            <div className='pt-[18px] w-full'>
              <div className='flex items-center gap-8 text-[18px] mb-2'>
                <div className='text-black font-semibold w-1/4'>Chủ sở hữu</div>
                <div>-</div>
                <div>{restaurantInfo.owner}</div>
              </div>
              <div className='flex items-start gap-8 text-[18px] mb-2'>
                <div className='text-black font-semibold w-1/4'>Mô tả</div>
                <div>-</div>
                <div>{restaurantInfo.description}</div>
              </div>
              <div className='flex items-center gap-8 text-[18px] mb-2'>
                <div className='text-black font-semibold w-1/4'>Ẩm thực</div>
                <div>-</div>
                <div>{restaurantInfo.cuisineType}</div>
              </div>
              <div className='flex items-center gap-8 text-[18px] mb-2'>
                <div className='text-black font-semibold w-1/4'>Thời gian mở</div>
                <div>-</div>
                <div>{restaurantInfo.openHours}</div>
              </div>
              <div className='flex items-center gap-8 text-[18px] mb-2'>
                <div className='text-black font-semibold w-1/4'>Trạng thái</div>
                <div>-</div>
                <div>
                  {!isOpenRestaurant ? (
                    <span className='bg-red-100 text-red-800 text-sm font-medium me-2 px-3.5 py-1.5 rounded '>
                      Close
                    </span>
                  ) : (
                    <span className='bg-green-100 text-green-800 text-sm font-medium me-2 px-3.5 py-1.5 rounded '>
                      Open
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-3 gap-4 mt-[30px]'>
            <div className='col-span-3 sm:col-span-2 p-4 border-2 border-gray-200 border-dashed rounded-lg bg-slate-50'>
              <h5 className='text-[24px] font-semibold pb-[16px]'>Địa chỉ nhà hàng</h5>
              <div className='flex items-center gap-8 text-[18px] mb-2'>
                <div className='text-black font-semibold w-1/4'>Tỉnh/Thành Phố</div>
                <div>-</div>
                <div>{restaurantInfo.address.city}</div>
              </div>
              <div className='flex items-center gap-8 text-[18px] mb-2'>
                <div className='text-black font-semibold w-1/4'>Quận/Huyện</div>
                <div>-</div>
                <div>{restaurantInfo.address.district}</div>
              </div>
              <div className='flex items-center gap-8 text-[18px] mb-2'>
                <div className='text-black font-semibold w-1/4'>Xã/Phường</div>
                <div>-</div>
                <div>{restaurantInfo.address.ward}</div>
              </div>
              <div className='flex items-center gap-8 text-[18px] mb-2'>
                <div className='text-black font-semibold w-1/4'>Tên đường</div>
                <div>-</div>
                <div>
                  {restaurantInfo.address.numberStreet} {restaurantInfo.address.street}
                </div>
              </div>
            </div>
            <div className='p-4 border-2 col-span-3 sm:col-span-1 border-gray-200 border-dashed rounded-lg bg-slate-50'>
              <h5 className='text-[24px] font-semibold pb-[16px]'>Liên hệ</h5>
              <div className='flex items-center gap-8 text-[18px] mb-2'>
                <div className='text-black font-semibold w-1/4'>Điện thoại</div>
                <div>-</div>
                <div>{restaurantInfo.contactInfo.mobile}</div>
              </div>
              <div className='flex items-center gap-8 text-[18px] mb-2'>
                <div className='text-black font-semibold w-1/4'>Email</div>
                <div>-</div>
                <div>{restaurantInfo.contactInfo.primary_email}</div>
              </div>
              <div className='flex items-center gap-8 text-[18px] mb-2'>
                <div className='text-black font-semibold w-1/4'>Facebook</div>
                <div>-</div>
                <div>
                  <a href={restaurantInfo.contactInfo.facebook} target='_blank' rel='noreferrer'>
                    <FacebookRoundedIcon />
                  </a>
                </div>
              </div>
              <div className='flex items-center gap-8 text-[18px] mb-2'>
                <div className='text-black font-semibold w-1/4'>Instagram</div>
                <div>-</div>
                <div>
                  <a href={restaurantInfo.contactInfo.instagram} target='_blank' rel='noreferrer'>
                    <InstagramIcon />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
