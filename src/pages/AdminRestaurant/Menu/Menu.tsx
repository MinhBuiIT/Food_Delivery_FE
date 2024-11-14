import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { Box } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { changeAvailableFoodApi, changeDisableFoodApi, getFoodListApi } from 'src/apis/AdminRes/adminres.api'
import ModalFood from 'src/components/ModalFood'
import ModalFoodDetail from 'src/components/ModalFoodDetail'
import { FoodAdminType } from 'src/types/FoodType'

const columnsFood: GridColDef<FoodAdminType>[] = [
  { field: 'id', headerName: 'ID', width: 50, sortable: true },
  {
    field: 'name',
    headerName: 'Tên món ăn',
    width: 200,
    editable: true
  },
  {
    field: 'description',
    headerName: 'Mô tả',
    width: 200
  },
  {
    field: 'price',
    headerName: 'Giá',
    width: 100
  },
  {
    field: 'available',
    headerName: 'Có sẵn',
    width: 100,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: (params: GridRenderCellParams<any, boolean>) => {
      return (
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
    }
  },
  {
    field: 'disable',
    headerName: 'Ẩn',
    width: 100,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: (params: GridRenderCellParams<any, boolean>) => {
      return (
        <>
          {params.value ? (
            <button className='bg-green-100 text-gray-700 text-sm font-medium me-2 px-2.5 py-1.5 rounded dark:bg-green-300 w-full'>
              <CheckIcon sx={{ color: 'white' }} />
            </button>
          ) : (
            <button className=' text-gray-700 text-sm font-medium me-2 px-2.5 py-1.5 rounded bg-red-300 w-full'>
              <CloseIcon sx={{ color: 'white' }} />
            </button>
          )}
        </>
      )
    }
  },
  {
    field: 'categoryFood',
    headerName: 'Tên loại',
    width: 200,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: (params: GridRenderCellParams<any, { id: number; name: string }>) => {
      return <>{params.value?.name}</>
    }
  },
  {
    field: 'Detail',
    headerName: '',
    width: 100,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: () => {
      return (
        <button type='button' className='text-dark bg-transparent font-medium'>
          Xem chi tiết
        </button>
      )
    }
  }
]
const Menu = () => {
  const [rowFoods, setRowFoods] = useState<FoodAdminType[]>([])
  const [foodDetail, setFoodDetail] = useState<number | null>(null)
  const [openModalDetail, setOpenModalDetail] = useState(false)
  const [openModalFood, setOpenModalFood] = useState(false)

  const getFoodQuery = useQuery({
    queryKey: ['getFood'],
    queryFn: getFoodListApi
  })

  const changeAvailableFoodMutation = useMutation({
    mutationFn: (id: number) => changeAvailableFoodApi(id)
  })

  const changeDisableFoodMutation = useMutation({
    mutationFn: (id: number) => changeDisableFoodApi(id)
  })

  const foodData = useMemo(() => getFoodQuery.data?.data.metadata || [], [getFoodQuery.data])

  useEffect(() => {
    if (foodData) {
      setRowFoods(foodData)
    }
  }, [foodData])
  const toggleOpenModalDetail = (open: boolean) => setOpenModalDetail(open)
  const toggleOpenModalFood = (open: boolean) => setOpenModalFood(open)
  return (
    <div>
      <h1 className='capitalize text-[48px] text-black font-semibold py-[20px] text-center'>Thực Đơn</h1>
      <div className='border-gray-200 border border-dashed rounded-lg bg-slate-50 p-4 mt-4'>
        <button className='text-blue-600 pb-3 text-[20px]' onClick={() => toggleOpenModalFood(true)}>
          + Thêm món ăn
        </button>
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={rowFoods}
            columns={columnsFood}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 8
                }
              }
            }}
            onCellClick={(params) => {
              if (params.field === 'Detail') {
                toggleOpenModalDetail(true)
                setFoodDetail(Number(params.row.id))
              } else if (params.field === 'available') {
                changeAvailableFoodMutation.mutate(Number(params.row.id), {
                  onSuccess: () => getFoodQuery.refetch()
                })
              } else if (params.field === 'disable') {
                changeDisableFoodMutation.mutate(Number(params.row.id), {
                  onSuccess: () => getFoodQuery.refetch()
                })
              }
            }}
            pageSizeOptions={[8]}
            disableRowSelectionOnClick
          />
        </Box>
      </div>

      <ModalFoodDetail open={openModalDetail} toggleOpenModalDetail={toggleOpenModalDetail} foodId={foodDetail} />
      <ModalFood open={openModalFood} toggleOpenModalFood={toggleOpenModalFood} />
    </div>
  )
}

export default Menu
