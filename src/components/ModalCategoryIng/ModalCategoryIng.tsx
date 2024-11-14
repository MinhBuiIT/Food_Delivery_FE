import { Modal } from '@mui/material'
import { InvalidateQueryFilters, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { addIngredientCateApi, updateIngredientCateApi } from 'src/apis/AdminRes/adminres.api'
import { isBadRequestError, isNotFoundError } from 'src/utils/helper'

interface ModalCategoryIngProps {
  openAddCategory: boolean
  toggleModalCategoryIng: (open: boolean) => void
  editItem: { id: number; name: string; pick: boolean } | null
  setEditItem: React.Dispatch<
    React.SetStateAction<{
      id: number
      name: string
      pick: boolean
    } | null>
  >
}

const ModalCategoryIng = ({
  openAddCategory,
  toggleModalCategoryIng,
  editItem,
  setEditItem
}: ModalCategoryIngProps) => {
  const queryClient = useQueryClient()
  const [categoryIngName, setCategoryIngName] = useState('')
  const [pick, setPick] = useState(0)

  const addCategoryIngMutation = useMutation({
    mutationFn: (data: { name: string; pick: boolean }) => addIngredientCateApi(data)
  })
  const updateCategoryIngMutation = useMutation({
    mutationFn: (data: { name: string; pick: boolean; id: number }) => updateIngredientCateApi(data)
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (categoryIngName.trim() === '') {
      toast.error('Vui lòng nhập tên loại thành phần')
      return
    }
    if (editItem) {
      updateCategoryIngMutation.mutate(
        { name: categoryIngName.trim(), pick: Boolean(pick), id: editItem.id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(['category-ingre-list'] as InvalidateQueryFilters)
            toggleModalCategoryIng(false)
            setEditItem(null)
            setCategoryIngName('')
            toast.success('Sửa loại thành phần thành công')
          },
          onError: () => {
            toast.error('Sửa loại thành phần thất bại')
          }
        }
      )
      return
    } else {
      addCategoryIngMutation.mutate(
        { name: categoryIngName.trim(), pick: Boolean(pick) },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(['category-ingre-list'] as InvalidateQueryFilters)
            toggleModalCategoryIng(false)
            setCategoryIngName('')
            toast.success('Thêm loại thành phần thành công')
          },
          onError: (error) => {
            if (
              isNotFoundError<{ error: number; message: string }>(error) ||
              isBadRequestError<{ error: number; message: string }>(error)
            ) {
              toast.error(error.response?.data.message || 'Có lỗi xảy ra')
              return
            }
            toast.error('Thêm loại thành phần thất bại')
          }
        }
      )
    }
  }
  useEffect(() => {
    if (editItem) {
      setCategoryIngName(editItem.name)
      setPick(editItem.pick ? 1 : 0)
    }
  }, [editItem])
  return (
    <Modal
      open={openAddCategory}
      onClose={() => {
        toggleModalCategoryIng(false)
        setEditItem(null)
        setCategoryIngName('')
      }}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      className='flex justify-center items-center'
    >
      <div className='w-[300px] min-h-[200px] rounded bg-white p-4'>
        <h3 className='text-[20px] pb-4'>{editItem ? 'Cập Nhật' : 'Thêm'} loại thành phần</h3>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Tên loại'
            className='w-full border-2 border-gray-200 rounded-lg p-2 py-3'
            value={categoryIngName}
            onChange={(e) => setCategoryIngName(e.target.value)}
          />
          <div className='flex mt-3'>
            <div className='flex items-center me-4'>
              <input
                id='inline-radio'
                type='radio'
                name='pick'
                defaultValue={1}
                checked={pick === 1}
                onChange={() => setPick(1)}
                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 '
              />
              <label htmlFor='inline-radio' className='ms-2 text-base font-medium text-gray-900 '>
                Bắt buộc
              </label>
            </div>
            <div className='flex items-center me-4'>
              <input
                id='inline-2-radio'
                type='radio'
                defaultValue={0}
                name='pick'
                checked={pick === 0}
                onChange={() => setPick(0)}
                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 '
              />
              <label htmlFor='inline-2-radio' className='ms-2 text-base font-medium text-gray-900 '>
                Lựa chọn
              </label>
            </div>
          </div>

          <button className='w-full bg-blue-500 text-white rounded mt-4 py-2 text-[18px] capitalize'>
            {editItem ? 'Cập nhật' : 'Thêm'}
          </button>
        </form>
      </div>
    </Modal>
  )
}

export default ModalCategoryIng
