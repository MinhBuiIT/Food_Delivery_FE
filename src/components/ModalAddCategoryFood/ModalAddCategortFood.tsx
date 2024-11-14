import { Modal } from '@mui/material'
import { InvalidateQueryFilters, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { createCategoryFoodApi, updateCategoryFoodApi } from 'src/apis/AdminRes/adminres.api'

interface ModalAddCategortFoodProps {
  openAddCategory: boolean
  toggleAddCategory: (open: boolean) => void
  editItem: { id: number; name: string } | null
  setEditItem: React.Dispatch<
    React.SetStateAction<{
      id: number
      name: string
    } | null>
  >
}

const ModalAddCategortFood = ({
  openAddCategory,
  toggleAddCategory,
  editItem,
  setEditItem
}: ModalAddCategortFoodProps) => {
  const queryClient = useQueryClient()
  const [categoryName, setCategoryName] = useState<string>('')

  const addFoodCategoryMutation = useMutation({
    mutationFn: (body: { name: string }) => createCategoryFoodApi(body)
  })
  const updateFoodCategoryMutation = useMutation({
    mutationFn: (body: { name: string; id: number }) => updateCategoryFoodApi(body)
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (categoryName.trim() === '') {
      toast.error('Tên loại không được để trống')
      return
    }
    if (editItem) {
      updateFoodCategoryMutation.mutate(
        { name: categoryName, id: editItem.id },
        {
          onSuccess: () => {
            toast.success('Sửa loại thành công')
            setEditItem(null)
            setCategoryName('')
            toggleAddCategory(false)
            queryClient.invalidateQueries(['category-list'] as InvalidateQueryFilters)
          },
          onError: () => {
            toast.error('Sửa loại thất bại')
          }
        }
      )
    } else {
      addFoodCategoryMutation.mutate(
        { name: categoryName },
        {
          onSuccess: () => {
            toast.success('Thêm loại thành công')
            toggleAddCategory(false)
            setCategoryName('')
            queryClient.invalidateQueries(['category-list'] as InvalidateQueryFilters)
          },
          onError: () => {
            toast.error('Thêm loại thất bại')
          }
        }
      )
    }
  }
  useEffect(() => {
    if (editItem) {
      setCategoryName(editItem.name)
    }
  }, [editItem])
  return (
    <Modal
      open={openAddCategory}
      onClose={() => {
        toggleAddCategory(false)
        setEditItem(null)
        setCategoryName('')
      }}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      className='flex justify-center items-center'
    >
      <div className='w-[300px] min-h-[200px] rounded bg-white p-4'>
        <h3 className='text-[20px] pb-4'>Thêm loại đồ ăn</h3>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Tên loại'
            className='w-full border-2 border-gray-200 rounded-lg p-2 py-3'
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <button className='w-full bg-blue-500 text-white rounded mt-4 py-2 text-[18px] capitalize'>
            {editItem ? 'Sửa' : 'Thêm'}
          </button>
        </form>
      </div>
    </Modal>
  )
}

export default ModalAddCategortFood
