import { Modal } from '@mui/material'
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { createEventApi, getFoodListApi } from 'src/apis/AdminRes/adminres.api'
import { EventTypeBody } from 'src/types/EventType'
import { fromDateToString } from 'src/utils/helper'

interface ModalEventProps {
  openModalEvent: boolean
  toggleOpenModalEvent: (value: boolean) => void
}
interface FormEventData {
  startTime: string
  endTime: string
  eventType: number
  value: string
}
const ModalEvent = ({ openModalEvent, toggleOpenModalEvent }: ModalEventProps) => {
  const queryClient = useQueryClient()
  const [isSomeFood, setIsSomeFood] = useState(false)
  const [formEventData, setFormEventData] = useState<FormEventData>({
    startTime: '',
    endTime: '',
    eventType: 0,
    value: ''
  })
  const [foodSelected, setFoodSelected] = useState<{ foodName: string; id: number }[]>([])

  const getAllFood = useQuery({
    queryKey: ['food-list'],
    queryFn: () => getFoodListApi(),
    enabled: openModalEvent,
    staleTime: 2 * 60 * 1000 //2 minutes
  })

  const createEventMutation = useMutation({
    mutationFn: (data: EventTypeBody) => createEventApi(data)
  })

  const foodData = getAllFood.data?.data.metadata || []
  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormEventData({
      ...formEventData,
      [e.target.name]: e.target.value
    })
  }
  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (formEventData.startTime === '' || formEventData.endTime === '' || formEventData.value === '') {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }
    if (new Date(formEventData.startTime) > new Date(formEventData.endTime)) {
      toast.error('Thời gian bắt đầu không thể lớn hơn thời gian kết thúc')
      return
    }
    const now = new Date()
    if (new Date(formEventData.startTime) < now && new Date(formEventData.endTime) < now) {
      toast.error('Thời gian bắt đầu và kết thúc không thể nhỏ hơn thời gian hiện tại')
      return
    }
    if (foodSelected.length === 0 && isSomeFood) {
      toast.error('Vui lòng chọn món ăn áp dụng')
      return
    }
    if (isNaN(Number(formEventData.value))) {
      toast.error('Giá trị không hợp lệ')
      return
    }
    if (formEventData.eventType === 0 && (Number(formEventData.value) < 0 || Number(formEventData.value) > 100)) {
      toast.error('Phần trăm giảm không hợp lệ')
      return
    }
    const foodIds = isSomeFood ? foodSelected.map((food) => +food.id) : []
    const dataConfig: EventTypeBody = {
      startTime: fromDateToString(new Date(formEventData.startTime)),
      endTime: fromDateToString(new Date(formEventData.endTime)),
      eventType: +formEventData.eventType,
      value: +formEventData.value,
      allFood: !isSomeFood,
      foods: foodIds
    }
    createEventMutation.mutate(dataConfig, {
      onSuccess: () => {
        toast.success('Thêm sự kiện thành công')
        queryClient.invalidateQueries(['event-list'] as InvalidateQueryFilters)
        toggleOpenModalEvent(false)
      },
      onError: () => {
        toast.error('Thêm sự kiện thất bại')
      }
    })
    console.log(formEventData)
  }

  return (
    <Modal
      open={openModalEvent}
      onClose={() => {
        toggleOpenModalEvent(false)
      }}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      className='flex justify-center items-center'
    >
      <div className='w-[450px] bg-white p-4 rounded'>
        <h3 className='text-[22px] pb-4'>Thêm sự kiện</h3>
        <form onSubmit={handleSubmitForm}>
          <div className='w-full'>
            <label htmlFor='startTime' className='text-[18px]'>
              Ngày bắt đầu
            </label>
            <br />
            <input
              type='datetime-local'
              id='startTime'
              name='startTime'
              className='w-full mt-1'
              onChange={handleChangeForm}
              value={formEventData.startTime}
            />
          </div>
          <div className='w-full mt-5'>
            <label htmlFor='endTime' className='text-[18px]'>
              Ngày kết thúc
            </label>
            <br />
            <input
              type='datetime-local'
              id='endTime'
              name='endTime'
              className='w-full mt-1'
              onChange={handleChangeForm}
              value={formEventData.endTime}
            />
          </div>

          <div className='flex mt-5 w-full gap-5'>
            <div className='flex items-center'>
              <input
                id='percent'
                type='radio'
                value={0}
                name='eventType'
                defaultChecked
                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 '
                onChange={handleChangeForm}
              />
              <label htmlFor='percent' className='ms-2 text-base font-medium text-gray-900 '>
                Giảm theo phần trăm
              </label>
            </div>
            <div className='flex items-center'>
              <input
                id='amount'
                type='radio'
                value={1}
                name='eventType'
                onChange={handleChangeForm}
                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 '
              />
              <label htmlFor='amount' className='ms-2 text-base font-medium text-gray-900 '>
                Giảm theo số tiền
              </label>
            </div>
          </div>
          <div className='mt-5 w-full'>
            <input
              type='text'
              className='w-full'
              placeholder='Nhập giá trị'
              name='value'
              id='value'
              value={formEventData.value}
              onChange={handleChangeForm}
            />
          </div>

          <h4 className='mt-4 font-semibold text-[18px]'>Chọn món ăn áp dụng</h4>
          <div className='mt-2 w-full flex gap-5'>
            <div className='flex items-center'>
              <input
                id='allFood'
                type='radio'
                value={0}
                name='foodEvent'
                defaultChecked
                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 '
                onChange={(e) => {
                  if (e.target.checked) {
                    setIsSomeFood(false)
                  }
                }}
              />
              <label htmlFor='allFood' className='ms-2 text-base font-medium text-gray-900 '>
                Tất cả món ăn
              </label>
            </div>
            <div className='flex items-center'>
              <input
                id='someFood'
                type='radio'
                value={1}
                name='foodEvent'
                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 '
                onChange={(e) => {
                  if (e.target.checked) {
                    setIsSomeFood(true)
                  }
                }}
              />
              <label htmlFor='someFood' className='ms-2 text-base font-medium text-gray-900 '>
                Chọn món ăn
              </label>
            </div>
          </div>

          {isSomeFood && foodData.length > 0 ? (
            <div className='w-full mt-5'>
              <select
                id='countries'
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '
                defaultValue={'DEFAULT'}
                onChange={(e) => {
                  const food = foodData.find((food) => food.id === Number(e.target.value))
                  if (food) {
                    if (!foodSelected.some((item) => item.id === food.id)) {
                      setFoodSelected([...foodSelected, { foodName: food.name, id: food.id }])
                    }
                  }
                }}
              >
                <option value='DEFAULT' disabled>
                  Chọn món ăn
                </option>
                {foodData.map((food) => (
                  <option key={food.id} value={food.id}>
                    {food.name}
                  </option>
                ))}
              </select>
              <div className='flex items-center gap-3 mt-3 flex-wrap'>
                {foodSelected.length > 0 &&
                  foodSelected.map((food) => (
                    <span key={food.id} className='rounded-full bg-slate-200 text-gray-600 text-sm p-2'>
                      {food.foodName}
                    </span>
                  ))}
              </div>
            </div>
          ) : null}

          <button type='submit' className='w-full mt-4 rounded bg-blue-600 text-white capitalize py-2'>
            Xác nhận
          </button>
        </form>
      </div>
    </Modal>
  )
}

export default ModalEvent
