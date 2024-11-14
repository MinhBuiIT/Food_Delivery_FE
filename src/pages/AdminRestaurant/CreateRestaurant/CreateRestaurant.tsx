import { Container, FormLabel, Grid2, OutlinedInput } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import { createRestaurantApi, getRestaurantByOwnerApi } from 'src/apis/AdminRes/adminres.api'
import { getCityApi, getDistrictApi, getWardApi } from 'src/apis/city.api'
import { isBadRequestError, isNotFoundError } from 'src/utils/helper'

interface RestaurantInfoFormType {
  name: string
  description: string
  cuisine: string
  phone: string
  facebook: string
  instagram: string
  email: string
  openingTime: string
  closingTime: string
}
const initialRestaurantInfo: RestaurantInfoFormType = {
  name: '',
  description: '',
  cuisine: '',
  phone: '',
  facebook: '',
  instagram: '',
  email: '',
  openingTime: '07:00',
  closingTime: '12:00'
}

const CreateRestaurant = () => {
  //check đã nhập thông tin nhà hàng chưa
  const navigate = useNavigate()

  const getRestaurantInfoQuery = useQuery({
    queryKey: ['restaurant-info'],
    queryFn: () => getRestaurantByOwnerApi()
  })
  useEffect(() => {
    if (getRestaurantInfoQuery.isSuccess) {
      navigate('/admin/restaurant/dashboard', {
        state: { createdRestaurant: true }
      })
    }
  }, [getRestaurantInfoQuery.isSuccess])

  const toastRef = useRef<boolean>(false)
  const { state } = useLocation()

  const [city, setCity] = useState<{ id: string; name: string }>()
  const [district, setDistrict] = useState<{ id: string; name: string }>()
  const [ward, setWard] = useState<{ id: string; name: string }>()
  const [numberStreet, setNumberStreet] = useState('')
  const [street, setStreet] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [urlFileImg, setUrlFileImg] = useState<string | null>(null)
  const [infoRestaurant, setInfoRestaurant] = useState<RestaurantInfoFormType>(initialRestaurantInfo)

  //API
  const getCityQuery = useQuery({
    queryKey: ['getCity'],
    queryFn: getCityApi
  })
  const getDistrictQuery = useQuery({
    queryKey: ['getDistrict', city?.id],
    queryFn: () => getDistrictApi(city?.id || ''),
    enabled: Boolean(city?.id)
  })
  const getWardQuery = useQuery({
    queryKey: ['getWard', district?.id],
    queryFn: () => getWardApi(district?.id || ''),
    enabled: Boolean(district?.id)
  })
  const createRestaurantMutation = useMutation({
    mutationFn: (data: FormData) => createRestaurantApi(data)
  })
  //END API
  const cityData = getCityQuery.data?.data.data || []
  const districtData = getDistrictQuery.data?.data.data || []
  const wardData = getWardQuery.data?.data.data || []

  useEffect(() => {
    if (file) {
      setUrlFileImg(URL.createObjectURL(new Blob([file] as BlobPart[], { type: file.type })))
    }
  }, [file])

  useEffect(() => {
    if (state && state.pleaseCreateRestaurant === true && !toastRef.current) {
      toastRef.current = true
      toast.error('Vui lòng nhập thông tin nhà hàng ', {
        position: 'top-center'
      })
    }
  }, [state])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const timeRes = `${infoRestaurant.openingTime}AM - ${infoRestaurant.closingTime}PM`

    const formData = new FormData()
    for (const key in infoRestaurant) {
      if (key === 'openingTime' || key === 'closingTime') continue
      if (key === 'phone') {
        formData.append('mobile', infoRestaurant[key as keyof RestaurantInfoFormType] as string)
      } else if (key === 'email') {
        formData.append('primary_email', infoRestaurant[key as keyof RestaurantInfoFormType] as string)
      } else if (key === 'cuisine') {
        formData.append('cuisineType', infoRestaurant[key as keyof RestaurantInfoFormType] as string)
      } else {
        formData.append(key, infoRestaurant[key as keyof RestaurantInfoFormType] as string)
      }
    }
    formData.append('openingHours', timeRes)
    formData.append('city', city?.name || '')
    formData.append('district', district?.name || '')
    formData.append('ward', ward?.name || '')
    formData.append('street', street)
    formData.append('numberStreet', numberStreet)
    formData.append('postalCode', postalCode)
    if (file) {
      formData.append('files', file)
    }

    const toastId = toast.loading('Đang lưu thông tin...', {
      position: 'top-center'
    })
    createRestaurantMutation.mutate(formData, {
      onSuccess: (res) => {
        console.log(res)
        //xử lý khi tạo nhà hàng thành công

        toast.dismiss(toastId)
        toast.success('Tạo nhà hàng thành công', {
          position: 'top-center'
        })
        navigate('/admin/restaurant/dashboard')
      },
      onError: (error) => {
        toast.dismiss(toastId)
        if (
          isBadRequestError<{ error: number; message: string }>(error) ||
          isNotFoundError<{ error: number; message: string }>(error)
        ) {
          const message = error.response?.data.message || 'Error'
          toast.error(message, {
            position: 'top-center'
          })
        }

        toast.error('Tạo nhà hàng thất bại', {
          position: 'top-center'
        })
      }
    })
  }
  return (
    <Container maxWidth='lg' sx={{ padding: '30px 0' }}>
      <h1 className='py-5 text-[30px] font-semibold'>Nhập thông tin nhà hàng</h1>
      <form onSubmit={handleSubmit}>
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12 }} sx={{ display: 'flex', flexDirection: 'column' }}>
            <div className=' flex items-center justify-start bg-white '>
              <div className='rounded-lg overflow-hidden '>
                <div className='md:flex'>
                  <div className='w-full p-3'>
                    <div className='relative border-dotted h-40 rounded-lg  border-2 border-blue-700 bg-gray-100 flex justify-center items-center'>
                      <div className='absolute'>
                        <div className='flex flex-col items-center'>
                          <i className='fa fa-folder-open fa-4x text-blue-700' />
                          <span className='block text-gray-400 font-normal'>Chọn hình ảnh cho nhà hàng</span>
                        </div>
                      </div>
                      <input
                        type='file'
                        className='h-full w-full opacity-0'
                        name='files'
                        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                        accept='.jpg, .jpeg, .png'
                      />
                    </div>
                  </div>
                </div>
              </div>
              {urlFileImg && (
                <div>
                  <img src={urlFileImg} alt='preview' className='w-40 h-40 object-cover rounded' />
                </div>
              )}
            </div>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormLabel htmlFor='first-name'>Tên nhà hàng</FormLabel>
            <OutlinedInput
              required
              id='name'
              name='name'
              type='name'
              placeholder='Tên nhà hàng'
              size='small'
              className='mt-2'
              value={infoRestaurant.name}
              onChange={(e) => setInfoRestaurant({ ...infoRestaurant, name: e.target.value })}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormLabel htmlFor='description'>Mô tả</FormLabel>
            <OutlinedInput
              required
              id='description'
              name='description'
              type='text'
              placeholder='Mô tả'
              autoComplete='description'
              size='small'
              className='mt-2'
              value={infoRestaurant.description}
              onChange={(e) => setInfoRestaurant({ ...infoRestaurant, description: e.target.value })}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormLabel htmlFor='cuisine'>Kiểu đồ ăn</FormLabel>
            <OutlinedInput
              required
              id='cuisine'
              name='cuisine'
              type='text'
              placeholder='Kiểu đồ ăn'
              autoComplete='cuisine'
              size='small'
              className='mt-2'
              value={infoRestaurant.cuisine}
              onChange={(e) => setInfoRestaurant({ ...infoRestaurant, cuisine: e.target.value })}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 3 }} sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormLabel htmlFor='phone'>Số điện thoại</FormLabel>
            <OutlinedInput
              required
              id='phone'
              name='phone'
              type='text'
              placeholder='Số điện thoại'
              autoComplete='phone'
              size='small'
              className='mt-2'
              value={infoRestaurant.phone}
              onChange={(e) => setInfoRestaurant({ ...infoRestaurant, phone: e.target.value })}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 3 }} sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormLabel htmlFor='facebook'>Facebook</FormLabel>
            <OutlinedInput
              required
              id='facebook'
              name='facebook'
              type='text'
              placeholder='Facebook'
              autoComplete='facebook'
              size='small'
              className='mt-2'
              value={infoRestaurant.facebook}
              onChange={(e) => setInfoRestaurant({ ...infoRestaurant, facebook: e.target.value })}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 3 }} sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormLabel htmlFor='instagram'>Instagram</FormLabel>
            <OutlinedInput
              required
              id='instagram'
              name='instagram'
              type='text'
              placeholder='Instagram'
              autoComplete='instagram'
              size='small'
              className='mt-2'
              value={infoRestaurant.instagram}
              onChange={(e) => setInfoRestaurant({ ...infoRestaurant, instagram: e.target.value })}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 3 }} sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormLabel htmlFor='email'>Email</FormLabel>
            <OutlinedInput
              required
              id='email'
              name='email'
              type='text'
              placeholder='Email'
              autoComplete='email'
              size='small'
              className='mt-2'
              value={infoRestaurant.email}
              onChange={(e) => setInfoRestaurant({ ...infoRestaurant, email: e.target.value })}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 3 }} sx={{ display: 'flex', flexDirection: 'column' }}>
            <div>
              <label htmlFor='time' className='block mb-2 text-sm font-medium text-gray-900 '>
                Thời gian mở cửa
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none'>
                  <svg
                    className='w-4 h-4 text-gray-200 '
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      fillRule='evenodd'
                      d='M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <input
                  type='time'
                  id='time'
                  className='bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  name='openingTime'
                  defaultValue={initialRestaurantInfo.openingTime}
                  required
                  onChange={(e) => {
                    console.log(e)

                    setInfoRestaurant({ ...infoRestaurant, openingTime: e.target.value })
                  }}
                />
              </div>
            </div>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 3 }} sx={{ display: 'flex', flexDirection: 'column' }}>
            <div>
              <label htmlFor='time' className='block mb-2 text-sm font-medium text-gray-900 '>
                Thời gian đóng cửa
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none'>
                  <svg
                    className='w-4 h-4 text-gray-200 '
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      fillRule='evenodd'
                      d='M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <input
                  type='time'
                  id='time'
                  className='bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  name='closingTime'
                  defaultValue={initialRestaurantInfo.closingTime}
                  required
                  onChange={(e) => setInfoRestaurant({ ...infoRestaurant, closingTime: e.target.value })}
                />
              </div>
            </div>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 3 }} sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormLabel htmlFor='city'>Tỉnh/Thành Phố</FormLabel>
            <select
              id='city'
              className='bg-gray-50 border border-gray-300 text-gray-900  rounded-lg outline-none block w-full p-2.5 text-base'
              defaultValue={'DEFAULT'}
              onChange={(e) => {
                const city = cityData.find((city) => city.name === e.target.value)
                if (city) {
                  setCity({ id: city.id, name: city.name })
                }
              }}
            >
              <option value='DEFAULT' disabled>
                Tỉnh/Thành Phố
              </option>
              {cityData.length > 0 &&
                cityData.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
            </select>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 3 }} sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormLabel htmlFor='district'>Quận/Huyện</FormLabel>
            <select
              id='district'
              className='bg-gray-50 border border-gray-300 text-gray-900  rounded-lg outline-none block w-full p-2.5 text-base'
              defaultValue={'DEFAULT'}
              onChange={(e) => {
                const district = districtData.find((district) => district.name === e.target.value)
                if (district) {
                  setDistrict({ id: district.id, name: district.name })
                }
              }}
            >
              <option value='DEFAULT' disabled>
                Quận/Huyện
              </option>
              {districtData.length > 0 &&
                districtData.map((district) => (
                  <option key={district.id} value={district.name}>
                    {district.name}
                  </option>
                ))}
            </select>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 3 }} sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormLabel htmlFor='ward'>Xã/Phường</FormLabel>
            <select
              id='ward'
              className='bg-gray-50 border border-gray-300 text-gray-900  rounded-lg outline-none block w-full p-2.5 text-base'
              defaultValue={'DEFAULT'}
              onChange={(e) => {
                const ward = wardData.find((ward) => ward.name === e.target.value)
                if (ward) {
                  setWard({ id: ward.id, name: ward.name })
                }
              }}
            >
              <option value='DEFAULT' disabled>
                Xã/Phường
              </option>
              {wardData.length > 0 &&
                wardData.map((ward) => (
                  <option key={ward.id} value={ward.name}>
                    {ward.name}
                  </option>
                ))}
            </select>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 3 }} sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormLabel htmlFor='street'>Tên Đường</FormLabel>
            <OutlinedInput
              id='street'
              name='street'
              type='text'
              placeholder='Tên Đường'
              autoComplete='street'
              size='small'
              className='mt-2'
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 3 }} sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormLabel htmlFor='numberStreet'>Địa chỉ chi tiết</FormLabel>
            <OutlinedInput
              id='numberStreet'
              name='numberStreet'
              type='text'
              placeholder='Địa chỉ chi tiết'
              autoComplete='numberStreet'
              size='small'
              className='mt-2'
              value={numberStreet}
              onChange={(e) => setNumberStreet(e.target.value)}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 3 }} sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormLabel htmlFor='postalCode'>Postal Code</FormLabel>
            <OutlinedInput
              id='postalCode'
              name='postalCode'
              type='text'
              placeholder='Postal Code'
              autoComplete='postalCode'
              size='small'
              className='mt-2'
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }} sx={{ display: 'flex', flexDirection: 'column' }}>
            <button
              type='submit'
              className='text-gray-900 text-[20px] hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg  px-5 py-2.5 text-center me-2 mb-2 '
            >
              Xác nhận
            </button>
          </Grid2>
        </Grid2>
      </form>
    </Container>
  )
}

export default CreateRestaurant
