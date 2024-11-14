import EditIcon from '@mui/icons-material/Edit'
import { Box } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useMemo, useState } from 'react'
import { getCategoryListResApi } from 'src/apis/AdminRes/adminres.api'
import ModalAddCategortFood from 'src/components/ModalAddCategoryFood'
import { MyAppAuthContext } from 'src/context/AppAuthContext'

const columns: GridColDef<[number]>[] = [
  { field: 'id', headerName: 'ID', width: 200, sortable: true },
  {
    field: 'name',
    headerName: 'Tên loại',
    width: 450,
    editable: true
  },
  {
    field: 'Edit',
    headerName: 'Chỉnh sửa',
    width: 350,
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

const Category = () => {
  const { restaurantId } = useContext(MyAppAuthContext)
  const [rows, setRows] = useState([])
  const [openAddCategory, setOpenAddCategory] = useState(false)
  const [editItem, setEditItem] = useState<{ id: number; name: string } | null>(null)
  const toggleAddCategory = (open: boolean) => setOpenAddCategory(open)

  const getCategoryListQuery = useQuery({
    queryKey: ['category-list'],
    queryFn: () => getCategoryListResApi(restaurantId as number),
    enabled: !!restaurantId
  })
  const categoryList = useMemo(() => getCategoryListQuery.data?.data.metadata || [], [getCategoryListQuery.data])

  useEffect(() => {
    if (categoryList && categoryList.length > 0) {
      const categoryListSort = [...categoryList].sort((a, b) => a.id - b.id)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setRows(categoryListSort as any)
    }
  }, [categoryList])

  return (
    <div>
      <h1 className='capitalize text-[48px] text-black font-semibold py-[20px] text-center'>Loại đồ ăn</h1>
      <div className='p-4 border-2 border-gray-200 border-dashed rounded-lg bg-slate-50'>
        <button className='text-blue-600 py-6 text-[20px]' onClick={() => toggleAddCategory(true)}>
          + Thêm loại đồ ăn
        </button>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
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
                setOpenAddCategory(true)
              }
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
          />
        </Box>
      </div>
      <ModalAddCategortFood
        openAddCategory={openAddCategory}
        toggleAddCategory={toggleAddCategory}
        editItem={editItem}
        setEditItem={setEditItem}
      />
    </div>
  )
}

export default Category
