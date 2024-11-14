import { Box } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { changeActiveEventApi, getEventListApi } from 'src/apis/AdminRes/adminres.api'
import ModalEvent from 'src/components/ModalEvent'
import { EventType } from 'src/types/EventType'
import { formatPrice } from 'src/utils/helper'

const columnsEvent: GridColDef<EventType>[] = [
  { field: 'id', headerName: 'ID', width: 50, sortable: true },
  {
    field: 'code',
    headerName: 'Mã sự kiện',
    width: 100,
    editable: true
  },
  {
    field: 'startTime',
    headerName: 'Thời gian bắt đầu',
    width: 150,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: (params: GridRenderCellParams<any, string>) => {
      return (
        <>
          {new Date(params.value as string).toLocaleDateString() +
            ' ' +
            new Date(params.value as string).toLocaleTimeString()}
        </>
      )
    }
  },
  {
    field: 'endTime',
    headerName: 'Thời gian kết thúc',
    width: 150,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: (params: GridRenderCellParams<any, string>) => {
      return (
        <>
          {new Date(params.value as string).toLocaleDateString() +
            ' ' +
            new Date(params.value as string).toLocaleTimeString()}
        </>
      )
    }
  },
  {
    field: 'type',
    headerName: 'Loại khuyến mãi',
    width: 150,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: (params: GridRenderCellParams<any, string>) => {
      return <>{params.value === 'PERCENT' ? 'Giảm giá %' : 'Giảm giá tiền'}</>
    }
  },
  {
    field: 'percent',
    headerName: 'Phần trăm giảm',
    width: 150,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: (params: GridRenderCellParams<any, string>) => {
      return <>{params?.value ? params.value + '%' : 'x'}</>
    }
  },
  {
    field: 'amount',
    headerName: 'Số tiền giảm',
    width: 150,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: (params: GridRenderCellParams<any, string>) => {
      return <>{params?.value ? formatPrice(Number(params.value)) + 'đ' : 'x'}</>
    }
  },
  {
    field: 'createdAt',
    headerName: 'Ngày tạo',
    width: 200,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: (params: GridRenderCellParams<any, string>) => {
      return (
        <>
          {new Date(params.value as string).toLocaleDateString() +
            ' ' +
            new Date(params.value as string).toLocaleTimeString()}
        </>
      )
    }
  },
  {
    field: 'active',
    headerName: 'Hiệu lực',
    width: 100,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: (params: GridRenderCellParams<any, boolean>) => {
      return (
        <>
          {params.value ? (
            <button className='bg-green-300  text-white text-sm font-medium me-2 px-2.5 py-1.5 rounded  w-full'>
              Có
            </button>
          ) : (
            <button className=' text-white text-sm font-medium me-2 px-2.5 py-1.5 rounded bg-red-300 w-full'>
              Không
            </button>
          )}
        </>
      )
    }
  }
]

const Event = () => {
  const [openModalEvent, setOpenModalEvent] = useState(false)
  const [rowEvents, setRowEvents] = useState<EventType[]>([])
  const [statusEvent, setStatusEvent] = useState<number>(-1)

  const getEventListQuery = useQuery({
    queryKey: ['event-list', statusEvent],
    queryFn: () => getEventListApi(statusEvent)
  })

  const changeActiveMutation = useMutation({
    mutationFn: (id: number) => changeActiveEventApi({ id })
  })

  const eventListData = useMemo(() => getEventListQuery.data?.data.metadata || [], [getEventListQuery.data])
  const toggleOpenModalEvent = (value: boolean) => {
    setOpenModalEvent(value)
  }
  useEffect(() => {
    if (eventListData) {
      setRowEvents(eventListData)
    }
  }, [eventListData])

  return (
    <div>
      <h1 className='capitalize text-[48px] text-black font-semibold py-[20px] text-center'>Sự Kiện Giảm Giá</h1>
      <div className='border-gray-200 border border-dashed rounded-lg bg-slate-50 p-4 mt-4'>
        <button className='text-blue-600 pb-3 text-[20px]' onClick={() => toggleOpenModalEvent(true)}>
          + Thêm sự kiện
        </button>
        <div className='inline-block w-[150px] mb-5 ms-3'>
          <select
            id='status'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            value={statusEvent}
            onChange={(e) => setStatusEvent(Number(e.target.value))}
          >
            <option value={-1}>ALL</option>
            <option value={1}>ACTIVE</option>
            <option value={0}>INACTIVE</option>
          </select>
        </div>
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={rowEvents}
            columns={columnsEvent}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 8
                }
              }
            }}
            onCellClick={(params) => {
              if (params.field === 'active') {
                changeActiveMutation.mutate(Number(params.row.id), {
                  onSuccess: () => getEventListQuery.refetch()
                })
              }
            }}
            pageSizeOptions={[8]}
            disableRowSelectionOnClick
          />
        </Box>
      </div>
      <ModalEvent openModalEvent={openModalEvent} toggleOpenModalEvent={toggleOpenModalEvent} />
    </div>
  )
}

export default Event
