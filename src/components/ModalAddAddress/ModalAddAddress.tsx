import { Modal } from '@mui/material'
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { addAddressApi } from 'src/apis/address.api'
import { getCityApi, getDistrictApi, getWardApi } from 'src/apis/city.api'
import { AddressType } from 'src/types/AddressType'

interface ModalAddAddressProps {
  openAddAddressModal: boolean
  toggleAddAddressModal: (open: boolean) => void
}
const ModalAddAddress = ({ openAddAddressModal, toggleAddAddressModal }: ModalAddAddressProps) => {
  const queryClient = useQueryClient()
  const [city, setCity] = useState<{ id: string; name: string }>()
  const [district, setDistrict] = useState<{ id: string; name: string }>()
  const [ward, setWard] = useState<{ id: string; name: string }>()
  const [street, setStreet] = useState('')
  const [numberStreet, setNumberStreet] = useState('')
  const [phone, setPhone] = useState('')
  const [postalCode, setPostalCode] = useState('')

  const getCityQuery = useQuery({
    queryKey: ['getCity'],
    queryFn: getCityApi,
    enabled: openAddAddressModal
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
  const addAddressMutation = useMutation({
    mutationFn: (data: Omit<AddressType, 'id' | 'addressDefault'>) => addAddressApi(data)
  })

  const cityData = getCityQuery.data?.data.data || []
  const districtData = getDistrictQuery.data?.data.data || []
  const wardData = getWardQuery.data?.data.data || []

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!city || !district || !ward || !street || !numberStreet || !phone) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }
    const data: Omit<AddressType, 'id' | 'addressDefault'> = {
      city: city.name,
      district: district.name,
      ward: ward.name,
      street,
      numberStreet,
      phone,
      postalCode
    }
    addAddressMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Thêm địa chỉ thành công')
        toggleAddAddressModal(false)
        queryClient.invalidateQueries(['getAddressDefault'] as InvalidateQueryFilters)
      },
      onError: () => {
        toast.error('Thêm địa chỉ thất bại')
      }
    })
  }
  return (
    <Modal
      open={openAddAddressModal}
      onClose={() => toggleAddAddressModal(false)}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div className='w-[450px] bg-white min-h-[100px] py-5 px-6'>
        <h3 className='text-2xl mb-4'>Địa chỉ mới</h3>
        <form className='w-full flex items-center gap-3 flex-wrap justify-between' onSubmit={handleSubmitForm}>
          <div className='w-[48%] mb-2'>
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
          </div>
          <div className='w-[48%] mb-2'>
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
          </div>
          <div className='w-[48%] mb-2'>
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
          </div>
          <div className='w-[48%] mb-2'>
            <input
              type='text'
              className='bg-gray-50 border border-gray-300 text-gray-900  rounded-lg outline-none block w-full p-2.5 text-base'
              placeholder='Tên đường'
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>
          <div className='w-[48%] mb-2'>
            <input
              type='text'
              className='bg-gray-50 border border-gray-300 text-gray-900  rounded-lg outline-none block w-full p-2.5 text-base'
              placeholder='Số nhà'
              value={numberStreet}
              onChange={(e) => setNumberStreet(e.target.value)}
            />
          </div>
          <div className='w-[48%] mb-2'>
            <input
              type='text'
              className='bg-gray-50 border border-gray-300 text-gray-900  rounded-lg outline-none block w-full p-2.5 text-base'
              placeholder='Postal code'
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
          <div className='w-[48%] mb-2'>
            <input
              type='text'
              className='bg-gray-50 border border-gray-300 text-gray-900  rounded-lg outline-none block w-full p-2.5 text-base'
              placeholder='Số điện thoại'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button className='w-full text-white uppercase py-2 bg-pri-dark' type='submit'>
            Xác nhận
          </button>
        </form>
      </div>
    </Modal>
  )
}

export default ModalAddAddress
