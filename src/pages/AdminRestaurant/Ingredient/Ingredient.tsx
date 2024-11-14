import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import EditIcon from '@mui/icons-material/Edit'
import { Box } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  deleteIngredientApi,
  getAllIngredientApi,
  getIngredientCateListApi,
  updateStockIngredientApi
} from 'src/apis/AdminRes/adminres.api'
import ModalCategoryIng from 'src/components/ModalCategoryIng'
import ModalIngredientItem from 'src/components/ModalIngredientItem'
import { formatPrice, isBadRequestError, isNotFoundError } from 'src/utils/helper'

const columnsIngredientCate: GridColDef<{ id: number; name: string; pick: boolean }>[] = [
  { field: 'id', headerName: 'ID', width: 50, sortable: true },
  {
    field: 'name',
    headerName: 'Tên loại',
    width: 200,
    editable: true
  },
  {
    field: 'pick',
    headerName: 'Bắt buộc',
    width: 100,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: (params: GridRenderCellParams<any, boolean>) => (
      <>
        {params.value ? (
          <span className='bg-green-100 text-gray-700 text-sm font-medium me-2 px-2.5 py-1.5 rounded dark:bg-green-300 '>
            Có
          </span>
        ) : (
          <span className=' text-gray-700 text-sm font-medium me-2 px-2.5 py-1.5 rounded bg-red-300 '>Không</span>
        )}
      </>
    )
  },
  {
    field: 'Edit',
    headerName: 'Chỉnh sửa',
    width: 100,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: () => {
      return (
        <button
          type='button'
          className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2  focus:outline-none'
        >
          <EditIcon />
        </button>
      )
    }
  }
]
export interface IngredientItemGridDataType {
  id: number
  name: string
  stock: boolean
  price: number
  category: string
}
const columnsIngredient: GridColDef<IngredientItemGridDataType>[] = [
  { field: 'id', headerName: 'ID', width: 50, sortable: true },
  {
    field: 'name',
    headerName: 'Tên thành phần',
    width: 200,
    editable: true
  },
  {
    field: 'price',
    headerName: 'Giá cả',
    width: 120,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: (params: GridRenderCellParams<any, number>) => <>{formatPrice(params.value as number)}</>
  },
  {
    field: 'stock',
    headerName: 'Có sẵn',
    width: 80,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: (params: GridRenderCellParams<any, boolean>) => (
      <>
        {params.value ? (
          <button className='bg-green-100 text-gray-700 text-sm font-medium me-2 px-2.5 py-1.5 rounded dark:bg-green-300 w-full'>
            Có
          </button>
        ) : (
          <button className=' text-gray-700 text-sm font-medium me-2 px-2.5 py-1.5 rounded bg-red-300 w-full'>
            Không
          </button>
        )}
      </>
    )
  },
  {
    field: 'category',
    headerName: 'Tên loại',
    width: 120
  },
  {
    field: 'Edit',
    headerName: 'Chỉnh sửa',
    width: 100,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: () => {
      return (
        <button
          type='button'
          className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2  focus:outline-none'
        >
          <EditIcon />
        </button>
      )
    }
  },
  {
    field: 'Remove',
    headerName: 'Xóa',
    width: 100,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: () => {
      return (
        <button
          type='button'
          className='text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2  focus:outline-none'
        >
          <DeleteRoundedIcon />
        </button>
      )
    }
  }
]

const Ingredient = () => {
  const [openModalCategoryIng, setOpenModalCategoryIng] = useState(false)
  const [openModalIngredient, setOpenModalIngredient] = useState(false)
  const [editItem, setEditItem] = useState<{ id: number; name: string; pick: boolean } | null>(null)
  const [rowsCategoryIngredient, setRowsCategoryIngredient] = useState<{ id: number; name: string; pick: boolean }[]>(
    []
  )
  const [rowsIngredient, setRowsIngredient] = useState<IngredientItemGridDataType[]>([])
  const [editIngredient, setEditIngredient] = useState<IngredientItemGridDataType | null>(null)

  const getCategoryListQuery = useQuery({
    queryKey: ['category-ingre-list'],
    queryFn: () => getIngredientCateListApi()
  })
  const getIngredientListQuery = useQuery({
    queryKey: ['ingredient-list'],
    queryFn: () => getAllIngredientApi()
  })
  const deleteIngredientMutation = useMutation({
    mutationFn: (id: number) => deleteIngredientApi(id)
  })
  const updateStockIngredientMutation = useMutation({
    mutationFn: (id: number) => updateStockIngredientApi(id)
  })

  const ingredientData = useMemo(() => {
    return getIngredientListQuery.data?.data.metadata
      ? getIngredientListQuery.data.data.metadata
          .map((item) => {
            const nameCategory = item.name
            return item.ingredients.map((ingredient) => ({ ...ingredient, category: nameCategory }))
          })
          .flatMap((item) => item)
      : []
  }, [getIngredientListQuery.data])

  const categoryIngredientList = useMemo(
    () => getCategoryListQuery.data?.data.metadata || [],
    [getCategoryListQuery.data]
  )

  useEffect(() => {
    if (categoryIngredientList && categoryIngredientList.length > 0) {
      const categoryIngredientListSort = [...categoryIngredientList].sort((a, b) => a.id - b.id)
      setRowsCategoryIngredient(categoryIngredientListSort)
    }
  }, [categoryIngredientList])

  useEffect(() => {
    if (ingredientData && ingredientData.length > 0) {
      setRowsIngredient(ingredientData)
    }
  }, [ingredientData])

  const toggleModalCategoryIng = (open: boolean) => setOpenModalCategoryIng(open)
  const toggleModalIngredient = (open: boolean) => setOpenModalIngredient(open)
  return (
    <div>
      <h1 className='capitalize text-[48px] text-black font-semibold py-[20px] text-center'>Thành phần món ăn</h1>
      <div className='grid grid-cols-5 gap-4 mt-[30px] '>
        <div className='col-span-5 md:col-span-3 border-gray-200 border-dashed rounded-lg bg-slate-50 p-4'>
          <h5 className='text-[24px] font-semibold pb-[16px]'>Thành phần</h5>
          <button className='text-blue-600 pb-3 text-[20px]' onClick={() => toggleModalIngredient(true)}>
            + Thêm thành phần
          </button>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={rowsIngredient}
              columns={columnsIngredient}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5
                  }
                }
              }}
              onCellClick={(params) => {
                if (params.field === 'Edit') {
                  setEditIngredient(params.row)
                  setOpenModalIngredient(true)
                } else if (params.field === 'Remove') {
                  deleteIngredientMutation.mutate(params.row.id, {
                    onSuccess: () => {
                      getIngredientListQuery.refetch()
                      toast.success('Xóa thành phần món ăn thành công')
                    },
                    onError: (error) => {
                      if (
                        isNotFoundError<{ error: number; message: string }>(error) ||
                        isBadRequestError<{ error: number; message: string }>(error)
                      ) {
                        toast.error(error.response?.data.message || 'Có lỗi xảy ra')
                        return
                      }
                      toast.error('Xóa thành phần thất bại')
                    }
                  })
                } else if (params.field === 'stock') {
                  updateStockIngredientMutation.mutate(params.row.id, {
                    onSuccess: () => {
                      getIngredientListQuery.refetch()
                      toast.success('Cập nhật thành công')
                    },
                    onError: (error) => {
                      if (
                        isNotFoundError<{ error: number; message: string }>(error) ||
                        isBadRequestError<{ error: number; message: string }>(error)
                      ) {
                        toast.error(error.response?.data.message || 'Có lỗi xảy ra')
                        return
                      }
                      toast.error('Cập nhật thất bại')
                    }
                  })
                }
              }}
              pageSizeOptions={[5]}
              disableRowSelectionOnClick
            />
          </Box>
          <ModalIngredientItem
            categoryIngredientList={categoryIngredientList}
            openAddCategory={openModalIngredient}
            toggleModalIngredient={toggleModalIngredient}
            editIngredient={editIngredient}
            setEditIngredient={setEditIngredient}
          />
        </div>
        <div className='col-span-5 md:col-span-2 order-first md:order-last border-gray-200 border-dashed rounded-lg bg-slate-50 p-4'>
          <h5 className='text-[24px] font-semibold pb-[16px]'>Loại thành phần</h5>
          <button className='text-blue-600 pb-3 text-[20px]' onClick={() => toggleModalCategoryIng(true)}>
            + Thêm loại thành phần
          </button>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={rowsCategoryIngredient}
              columns={columnsIngredientCate}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5
                  }
                }
              }}
              onCellClick={(params) => {
                if (params.field === 'Edit') {
                  setEditItem(params.row)
                  setOpenModalCategoryIng(true)
                }
              }}
              pageSizeOptions={[5]}
              disableRowSelectionOnClick
            />
          </Box>
          <ModalCategoryIng
            openAddCategory={openModalCategoryIng}
            toggleModalCategoryIng={toggleModalCategoryIng}
            editItem={editItem}
            setEditItem={setEditItem}
          />
        </div>
      </div>
    </div>
  )
}

export default Ingredient
