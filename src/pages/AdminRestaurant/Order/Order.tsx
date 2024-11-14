import { Box } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { getOrdersApi } from 'src/apis/AdminRes/adminres.api'
import ModalOrderDetail from 'src/components/ModalOrderDetail'
import OrderStatusChange from 'src/components/OrderStatusChange/OrderStatusChange'
import { OrderStatusNumEnum, OrderStatusTextEnum } from 'src/enums/OrderStatusEnum'
import { AddressType } from 'src/types/AddressType'
import { OrderType } from 'src/types/OrderType'
import { formatPrice, handleTime } from 'src/utils/helper'

const columnsOrder: GridColDef<OrderType>[] = [
  { field: 'id', headerName: 'ID', width: 50, sortable: true },
  {
    field: 'createdAt',
    headerName: 'Thời gian đặt hàng',
    width: 150,
    editable: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: (params: GridRenderCellParams<any, string>) => {
      return <>{handleTime(params.value as string)}</>
    }
  },
  {
    field: 'address',
    headerName: 'Địa chỉ',
    width: 400,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: (params: GridRenderCellParams<any, AddressType>) => {
      return (
        <>
          {params.value?.numberStreet +
            ', ' +
            params.value?.street +
            ', ' +
            params.value?.ward +
            ', ' +
            params.value?.district +
            ', ' +
            params.value?.city}
        </>
      )
    }
  },
  {
    field: 'customer',
    headerName: 'Người đặt',
    width: 150,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: (params: GridRenderCellParams<any, { id: number; fullName: string; email: string }>) => {
      return <>{params.value?.fullName}</>
    }
  },
  {
    field: 'totalItem',
    headerName: 'Tổng sản phẩm',
    width: 150
  },
  {
    field: 'totalPrice',
    headerName: 'Tổng đơn hàng',
    width: 150,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: (params: GridRenderCellParams<any, number>) => {
      return <>{formatPrice(params.value as number)}đ</>
    }
  },
  {
    field: 'orderStatus',
    headerName: 'Status',
    width: 130,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: (params: GridRenderCellParams<any, OrderStatusTextEnum>) => {
      return (
        <>
          {params.value !== OrderStatusTextEnum.CANCELLED ? (
            <span className='bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-blue-400'>
              {params.value}
            </span>
          ) : (
            <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-red-400'>
              {params.value}
            </span>
          )}
        </>
      )
    }
  },
  {
    field: 'ChangeStatus',
    headerName: '',
    width: 250,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: (params: any) => {
      return <OrderStatusChange id={params.row.id} status={params.row.orderStatus} />
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
type OrderTypeExtended = OrderType & { customer: { id: number; fullName: string; email: string } }
const Order = () => {
  const [rowOrders, setRowOrders] = useState<OrderType[]>([])
  const [openModalDetail, setOpenModalDetail] = useState(false)
  const [orderDetail, setOrderDetail] = useState<OrderTypeExtended | null>(null)
  const [statusOrder, setStatusOrder] = useState<OrderStatusNumEnum>(OrderStatusNumEnum.ALL)

  const getOrderQuery = useQuery({
    queryKey: ['order', statusOrder],
    queryFn: () => getOrdersApi(statusOrder)
  })
  const orderData = useMemo(() => getOrderQuery.data?.data.metadata || [], [getOrderQuery.data])

  useEffect(() => {
    if (orderData.length >= 0) {
      setRowOrders(orderData)
    }
  }, [orderData])

  const toggleModalDetail = (open: boolean) => {
    setOpenModalDetail(open)
  }
  return (
    <div>
      <h1 className='capitalize text-[48px] text-black font-semibold py-[20px] text-center'>Đơn hàng</h1>
      <div className='border-gray-200 border border-dashed rounded-lg bg-slate-50 p-4 mt-4'>
        <div className='inline-block w-[150px] mb-5'>
          <select
            id='status'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            value={statusOrder}
            onChange={(e) => setStatusOrder(Number(e.target.value) as OrderStatusNumEnum)}
          >
            <option value={OrderStatusNumEnum.ALL}>{OrderStatusTextEnum.ALL}</option>
            <option value={OrderStatusNumEnum.PENDING}>{OrderStatusTextEnum.PENDING}</option>
            <option value={OrderStatusNumEnum.CONFIRMED}>{OrderStatusTextEnum.CONFIRMED}</option>
            <option value={OrderStatusNumEnum.SHIPPING}>{OrderStatusTextEnum.SHIPPING}</option>
            <option value={OrderStatusNumEnum.DELIVERED}>{OrderStatusTextEnum.DELIVERED}</option>
            <option value={OrderStatusNumEnum.CANCELLED}>{OrderStatusTextEnum.CANCELLED}</option>
          </select>
        </div>
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={rowOrders}
            columns={columnsOrder}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 8
                }
              }
            }}
            onCellClick={(params) => {
              if (params.field === 'Detail') {
                toggleModalDetail(true)
                setOrderDetail(params.row as OrderTypeExtended)
              }
            }}
            pageSizeOptions={[8]}
            disableRowSelectionOnClick
          />
        </Box>
      </div>
      <ModalOrderDetail
        open={openModalDetail}
        handleClose={toggleModalDetail}
        orderDetailId={null}
        orderDetail={orderDetail}
      />
    </div>
  )
}

export default Order
