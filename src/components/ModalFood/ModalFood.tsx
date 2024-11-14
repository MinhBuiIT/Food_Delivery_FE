import CloseIcon from '@mui/icons-material/Close'
import { Modal } from '@mui/material'
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { createFoodApi, getAllIngredientApi, getCategoryListResApi } from 'src/apis/AdminRes/adminres.api'
import { MyAppAuthContext } from 'src/context/AppAuthContext'
import { isBadRequestError, isNotFoundError } from 'src/utils/helper'

interface ModalFoodProps {
  open: boolean
  toggleOpenModalFood: (open: boolean) => void
}
interface IngredientItemFormType {
  name: string
  description: string
  price: number
  vegetarian: boolean
  seasonal: boolean
  categoryFood: string
}
const initialIngredientItemForm: IngredientItemFormType = {
  name: '',
  description: '',
  price: 0,
  vegetarian: false,
  seasonal: false,
  categoryFood: ''
}
const ModalFood = ({ open, toggleOpenModalFood }: ModalFoodProps) => {
  const { restaurantId } = useContext(MyAppAuthContext)
  const queryClient = useQueryClient()
  const [ingredientListSelect, setIngredientListSelect] = useState<string[]>([])
  const [foodForm, setFoodForm] = useState<IngredientItemFormType>(initialIngredientItemForm)
  const [file, setFile] = useState<File | null>(null)
  const [urlFileImg, setUrlFileImg] = useState<string | null>(null)

  const getIngredientItem = useQuery({
    queryKey: ['ingredient-list-modal'],
    queryFn: () => getAllIngredientApi(),
    enabled: open && Boolean(restaurantId),
    staleTime: 1000 * 60 * 2 // 2 minutes
  })
  const getCategoryFood = useQuery({
    queryKey: ['category-food'],
    queryFn: () => getCategoryListResApi(restaurantId as number),
    enabled: open,
    staleTime: 1000 * 60 * 2 // 2 minutes
  })
  const categories = useMemo(() => getCategoryFood.data?.data.metadata || [], [getCategoryFood.data])

  const createFoodMutation = useMutation({
    mutationFn: (data: FormData) => createFoodApi(data)
  })

  const ingredientList = useMemo(() => getIngredientItem.data?.data.metadata || [], [getIngredientItem.data])
  const ingredientListName = useMemo(
    () =>
      ingredientList
        .map((item) => {
          return item.ingredients.map((item) => item.name)
        })
        .flatMap((item) => item),
    [ingredientList]
  )
  const handleChangeIngredient = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (!ingredientListSelect.includes(value.trim())) {
      setIngredientListSelect([...ingredientListSelect, value.trim()])
    }
  }
  const handleDeleteSelectIngredient = (value: string) => {
    setIngredientListSelect(ingredientListSelect.filter((item) => item !== value.trim()))
  }
  const handleChangeForm =
    (key: keyof IngredientItemFormType) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value
      if (key === 'price' && +value < 0) {
        toast.error('Giá không được nhỏ hơn 0')
        return
      }
      setFoodForm({
        ...foodForm,
        [key]: value
      })
    }
  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData()
    if (file) formData.append('file', file)
    else {
      toast.error('Vui lòng chọn file')
      return
    }

    const data = {
      ...foodForm,
      ingredients: ingredientListSelect
    }
    formData.append('data', JSON.stringify(data))

    const toastId = toast.loading('Đang thêm món ăn')
    createFoodMutation.mutate(formData, {
      onSuccess: () => {
        toast.dismiss(toastId)
        setIngredientListSelect([])
        setFoodForm(initialIngredientItemForm)
        setFile(null)
        setUrlFileImg(null)
        toggleOpenModalFood(false)
        toast.success('Thêm món ăn thành công')
        queryClient.invalidateQueries(['getFood'] as InvalidateQueryFilters)
      },
      onError: (error) => {
        toast.dismiss(toastId)
        if (
          isBadRequestError<{ error: number; message: string }>(error) ||
          isNotFoundError<{ error: number; message: string }>(error)
        ) {
          toast.error(error.response?.data.message || 'Có lỗi xảy ra, vui lòng thử lại sau')
        } else toast.error('Thêm món ăn thất bại')
      }
    })
  }
  useEffect(() => {
    if (file) {
      setUrlFileImg(URL.createObjectURL(new Blob([file] as BlobPart[], { type: file.type })))
    }
  }, [file])

  return (
    <Modal
      open={open}
      onClose={() => toggleOpenModalFood(false)}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      className='flex items-center justify-center'
    >
      <div className='w-[400px] min-h-[150px] bg-white shadow-md rounded p-4'>
        <h3 className='text-[20px] text-black mb-3'>Thêm món ăn</h3>
        <form onSubmit={handleSubmitForm}>
          <div className=' flex items-center justify-start bg-white '>
            <div className='rounded-lg overflow-hidden w-[60%]'>
              <div className='md:flex '>
                <div className='w-full p-3'>
                  <div className='relative border-dotted h-28 rounded-lg  border-2 border-blue-700 bg-gray-100 flex justify-center items-center'>
                    <div className='absolute'>
                      <div className='flex flex-col items-center'>
                        <i className='fa fa-folder-open fa-4x text-blue-700' />
                        <span className='block text-gray-400 font-normal px-3 text-center'>
                          Chọn hình ảnh cho món ăn
                        </span>
                      </div>
                    </div>
                    <input
                      type='file'
                      className='h-full w-full opacity-0'
                      name='files'
                      accept='.jpg, .jpeg, .png'
                      onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    />
                  </div>
                </div>
              </div>
            </div>
            {urlFileImg && (
              <div className='flex-1'>
                <img src={urlFileImg} alt='preview' className='w-full h-full object-cover rounded' />
              </div>
            )}
          </div>
          <div className='mb-3'>
            <input
              type='text'
              placeholder='Tên món ăn'
              className='w-full border-2 border-gray-200 rounded-lg p-2 py-3'
              value={foodForm.name}
              onChange={handleChangeForm('name')}
            />
          </div>
          <div className='mb-3'>
            <input
              type='text'
              placeholder='Mô tả'
              className='w-full border-2 border-gray-200 rounded-lg p-2 py-3'
              value={foodForm.description}
              onChange={handleChangeForm('description')}
            />
          </div>
          <div className='mb-4'>
            <input
              type='number'
              placeholder='Giá'
              min={0}
              className='w-full border-2 border-gray-200 rounded-lg p-2 py-3'
              value={foodForm.price}
              onChange={handleChangeForm('price')}
            />
          </div>
          <div className='mb-4 flex items-center gap-5'>
            <div className='flex items-center '>
              <input
                id='vegetarian'
                type='checkbox'
                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 '
                checked={foodForm.vegetarian}
                onChange={() => setFoodForm({ ...foodForm, vegetarian: !foodForm.vegetarian })}
              />
              <label htmlFor='vegetarian' className='ms-2 text-base font-medium text-gray-900 '>
                Món Chay
              </label>
            </div>
            <div className='flex items-center'>
              <input
                id='seasonal'
                type='checkbox'
                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 '
                checked={foodForm.seasonal}
                onChange={() => setFoodForm({ ...foodForm, seasonal: !foodForm.seasonal })}
              />
              <label htmlFor='seasonal' className='ms-2 text-base font-medium text-gray-900 '>
                Món Theo Mùa
              </label>
            </div>
          </div>
          <div className='mb-4'>
            <div>
              <select
                id='ingredient-category'
                className='bg-gray-50 border border-gray-300 text-gray-900 text-[16px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                defaultValue={'DEFAULT'}
                onChange={handleChangeForm('categoryFood')}
              >
                <option value='DEFAULT' disabled>
                  Chọn loại món ăn
                </option>
                {categories.map((item) => {
                  return (
                    <option value={item.name} key={item.id}>
                      {item.name}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
          <div className='mb-2'>
            <div>
              <select
                id='ingredient-category'
                className='bg-gray-50 border border-gray-300 text-gray-900 text-[16px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                defaultValue={'DEFAULT'}
                onChange={handleChangeIngredient}
              >
                <option value='DEFAULT' disabled>
                  Chọn thành phần món ăn
                </option>
                {ingredientListName.map((item) => {
                  return (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  )
                })}
              </select>
              <div className='flex items-center gap-3 flex-wrap mt-3'>
                {ingredientListSelect.map((item) => {
                  return (
                    <div
                      key={item}
                      className=' bg-gray-200 text-gray-800 text-base font-medium me-2 px-2.5 py-0.5 rounded inline-flex items-center'
                    >
                      <span>{item}</span>
                      <button type='button' className='ms-2 ' onClick={() => handleDeleteSelectIngredient(item)}>
                        <CloseIcon sx={{ fontSize: '16px' }} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <button className='w-full bg-blue-500 text-white rounded py-2 text-[18px] capitalize'>Thêm</button>
        </form>
      </div>
    </Modal>
  )
}

export default ModalFood
