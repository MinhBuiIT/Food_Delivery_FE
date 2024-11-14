import { Modal } from '@mui/material'
import { InvalidateQueryFilters, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { addIngredientApi, IngredientItemBody, updateIngredientApi } from 'src/apis/AdminRes/adminres.api'
import { IngredientItemGridDataType } from 'src/pages/AdminRestaurant/Ingredient/Ingredient'
import { isBadRequestError, isNotFoundError } from 'src/utils/helper'

interface ModalIngredientItemProps {
  openAddCategory: boolean
  toggleModalIngredient: (open: boolean) => void
  categoryIngredientList: {
    id: number
    name: string
    pick: boolean
  }[]
  editIngredient: IngredientItemGridDataType | null
  setEditIngredient: React.Dispatch<React.SetStateAction<IngredientItemGridDataType | null>>
}

const ModalIngredientItem = ({
  openAddCategory,
  toggleModalIngredient,
  categoryIngredientList,
  editIngredient,
  setEditIngredient
}: ModalIngredientItemProps) => {
  const queryClient = useQueryClient()
  const [nameIngredient, setNameIngredient] = useState<string>('')
  const [priceIngredient, setPriceIngredient] = useState<number>(0)
  const [categoryIngredient, setCategoryIngredient] = useState<string>('')

  const addIngredientItem = useMutation({
    mutationFn: (body: IngredientItemBody) => addIngredientApi(body)
  })
  const updateIngredientItem = useMutation({
    mutationFn: (body: Omit<IngredientItemBody, 'categoryIngredient'> & { id: number }) => updateIngredientApi(body)
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editIngredient) {
      if (nameIngredient.trim() === '' || priceIngredient < 0 || categoryIngredient.trim() === '') {
        toast.error('Vui lòng nhập đầy đủ thông tin')
        return
      }
      const data: IngredientItemBody = {
        name: nameIngredient.trim(),
        price: priceIngredient,
        categoryIngredient: categoryIngredient.trim()
      }
      addIngredientItem.mutate(data, {
        onSuccess: () => {
          queryClient.invalidateQueries(['ingredient-list'] as InvalidateQueryFilters)
          toggleModalIngredient(false)
          setNameIngredient('')
          setPriceIngredient(0)
          setCategoryIngredient('')
          toast.success('Thêm thành phần thành công')
        },
        onError: (error) => {
          if (
            isNotFoundError<{ error: number; message: string }>(error) ||
            isBadRequestError<{ error: number; message: string }>(error)
          ) {
            toast.error(error.response?.data.message || 'Có lỗi xảy ra')
            return
          }
          toast.error('Thêm thành phần thất bại')
        }
      })
    } else {
      if (nameIngredient.trim() === '' || priceIngredient < 0) {
        toast.error('Vui lòng nhập đầy đủ thông tin')
        return
      }
      const data: Omit<IngredientItemBody, 'categoryIngredient'> = {
        name: nameIngredient.trim(),
        price: priceIngredient
      }
      updateIngredientItem.mutate(
        { ...data, id: editIngredient.id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(['ingredient-list'] as InvalidateQueryFilters)
            toggleModalIngredient(false)
            setNameIngredient('')
            setPriceIngredient(0)
            setCategoryIngredient('')
            setEditIngredient(null)
            toast.success('Cập nhật thành phần thành công')
          },
          onError: (error) => {
            if (
              isNotFoundError<{ error: number; message: string }>(error) ||
              isBadRequestError<{ error: number; message: string }>(error)
            ) {
              toast.error(error.response?.data.message || 'Có lỗi xảy ra')
              return
            }
            toast.error('Cập nhật thành phần thất bại')
          }
        }
      )
    }
  }
  useEffect(() => {
    if (editIngredient) {
      setNameIngredient(editIngredient.name)
      setPriceIngredient(editIngredient.price)
    }
  }, [editIngredient])
  return (
    <Modal
      open={openAddCategory}
      onClose={() => {
        toggleModalIngredient(false)
      }}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      className='flex justify-center items-center'
    >
      <div className='w-[300px] min-h-[200px] rounded bg-white p-4'>
        <h3 className='text-[20px] pb-4'>{editIngredient ? 'Cập nhật' : 'Thêm'} thành phần</h3>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className='mb-2'>
            <input
              type='text'
              placeholder='Tên thành phần'
              className='w-full border-2 border-gray-200 rounded-lg p-2 py-3'
              value={nameIngredient}
              onChange={(e) => setNameIngredient(e.target.value)}
            />
          </div>
          <div className='mb-2'>
            <input
              type='number'
              placeholder='Giá cả'
              min={0}
              className='w-full border-2 border-gray-200 rounded-lg p-2 py-3'
              value={priceIngredient}
              onChange={(e) => setPriceIngredient(Number(e.target.value))}
            />
          </div>
          {!editIngredient && (
            <div>
              <div>
                <select
                  id='ingredient-category'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-[16px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                  defaultValue={'DEFAULT'}
                  onChange={(e) => setCategoryIngredient(e.target.value)}
                >
                  <option value='DEFAULT' disabled>
                    Chọn loại thành phần
                  </option>
                  {categoryIngredientList.map((item) => {
                    return (
                      <option value={item.name} key={item.id}>
                        {item.name}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>
          )}

          <button className='w-full bg-blue-500 text-white rounded mt-4 py-2 text-[18px] capitalize'>
            {editIngredient ? 'Cập nhật' : 'Thêm'}
          </button>
        </form>
      </div>
    </Modal>
  )
}

export default ModalIngredientItem
