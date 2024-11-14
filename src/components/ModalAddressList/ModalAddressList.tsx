import { Divider, Modal } from '@mui/material'
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getAddressListApi, updateDefaultAddressApi } from 'src/apis/address.api'

interface ModalAddressListProps {
  openAddressListModal: boolean
  toggleAddressListModal: (open: boolean) => void
  toggleAddAddressModal: (open: boolean) => void
}
const ModalAddressList = ({
  openAddressListModal,
  toggleAddressListModal,
  toggleAddAddressModal
}: ModalAddressListProps) => {
  const queryClient = useQueryClient()
  const [addressId, setAddressId] = useState<number | null>()

  const getAddressListQuery = useQuery({
    queryKey: ['getAddressList'],
    queryFn: () => getAddressListApi(),
    enabled: openAddressListModal
  })

  const updateDefaultAddressMutation = useMutation({
    mutationFn: (id: number) => updateDefaultAddressApi(id)
  })

  const data = useMemo(() => getAddressListQuery.data?.data.metadata || [], [getAddressListQuery.data])

  const handleClickAddAddress = () => {
    toggleAddressListModal(false)
    toggleAddAddressModal(true)
  }
  useEffect(() => {
    if (data.length > 0) {
      const addressDefault = data.find((item) => item.addressDefault)
      if (addressDefault) setAddressId(addressDefault.id)
    }
  }, [data])

  const handleConfirmAddress = () => {
    const addressDefault = data.find((item) => item.addressDefault)
    if (addressDefault?.id !== addressId) {
      //Call API to update address default
      if (addressId) {
        updateDefaultAddressMutation.mutate(addressId, {
          onSuccess: () => {
            queryClient.invalidateQueries(['getAddressDefault'] as InvalidateQueryFilters)
            toast.success('Cập nhật địa chỉ mặc định thành công')
            toggleAddressListModal(false)
          },
          onError: (err) => {
            toast.error(err.message)
          }
        })
      }
    } else {
      toggleAddressListModal(false)
    }
  }
  return (
    <Modal
      open={openAddressListModal}
      onClose={() => toggleAddressListModal(false)}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div className='w-[550px] bg-white h-[500px] py-5 px-6'>
        <h3 className='text-2xl mb-4'>Địa Chỉ Của Tôi</h3>
        <Divider />
        <div className='max-h-[80%] overflow-y-auto h-full'>
          {data.length > 0 &&
            data.map((item) => {
              return (
                <label htmlFor='green-radio' className='w-full ' key={item.id}>
                  <div className='flex items-center justify-between w-full pb-3 pt-4'>
                    <div className='flex items-center gap-5 ps-4'>
                      <input
                        id='green-radio'
                        type='radio'
                        value={item.id}
                        defaultChecked={item.addressDefault}
                        name='address'
                        className='w-5 h-5  text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500   focus:ring-2 '
                        onChange={() => setAddressId(item.id)}
                      />
                      <div className='text-[18px]'>
                        <div>{item.phone}</div>
                        <div className='text-gray-500'>
                          {item.numberStreet} {item.street}
                        </div>
                        <div className='text-gray-500'>
                          Phường {item.ward}, Quận {item.district}, {item.city}
                        </div>
                        {item.addressDefault && (
                          <div className='text-[16px] text-orange-400 px-2 border border-pri-dark inline-block'>
                            Mặc định
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Divider />
                </label>
              )
            })}

          <button className='text-pri-dark text-xl py-3' onClick={handleClickAddAddress}>
            + Thêm địa chỉ
          </button>
        </div>
        <button
          className='uppercase bg-pri-dark text-white py-3 w-full hover:opacity-90'
          onClick={handleConfirmAddress}
        >
          Xác Nhận
        </button>
      </div>
    </Modal>
  )
}

export default ModalAddressList
