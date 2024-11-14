import { Divider, Modal } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getFoodDetailApi } from 'src/apis/AdminRes/adminres.api'
import { formatPrice } from 'src/utils/helper'

interface ModalFoodDetailProps {
  open: boolean
  toggleOpenModalDetail: (open: boolean) => void
  foodId: number | null
}

const ModalFoodDetail = ({ open, toggleOpenModalDetail, foodId }: ModalFoodDetailProps) => {
  const getFoodDetailQuery = useQuery({
    queryKey: ['foodDetail', foodId],
    queryFn: () => getFoodDetailApi(Number(foodId)),
    enabled: !!foodId,
    staleTime: 1000 * 60 * 2 // 2 minutes
  })

  const foodDetailData = getFoodDetailQuery.data?.data.metadata || null
  return (
    <Modal
      open={open}
      onClose={() => toggleOpenModalDetail(false)}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      className='flex items-center justify-center'
    >
      <div>
        {foodDetailData && (
          <div className='w-[350px] min-h-[150px] p-5 bg-white rounded'>
            <div className='flex items-start justify-between text-[18px] mb-2'>
              <span className='font-semibold w-[50%] flex-shrink'>Tên món ăn</span>
              <span className='font-normal text-end'>{foodDetailData.name}</span>
            </div>
            <div className='flex items-start justify-between text-[18px] mb-2'>
              <span className='font-semibold w-[50%] flex-shrink'>Hình ảnh</span>
              <div className='w-[40px] h-[40px] overflow-hidden rounded'>
                <img src={foodDetailData.images[0]} alt={foodDetailData.name} className='w-full h-full object-cover' />
              </div>
            </div>
            <div className='flex items-start justify-between text-[18px] mb-2'>
              <span className='font-semibold w-[50%] flex-shrink'>Mô tả</span>
              <span className='font-normal text-end'>{foodDetailData.description}</span>
            </div>
            <div className='flex items-start justify-between text-[18px] mb-2'>
              <span className='font-semibold w-[50%] flex-shrink'>Giá</span>
              <span className='font-normal text-end'>{formatPrice(foodDetailData.price)}đ</span>
            </div>
            <div className='flex items-start justify-between text-[18px] mb-2'>
              <span className='font-semibold w-[50%] flex-shrink'>Tên loại</span>
              <span className='font-normal text-end'>{foodDetailData.categoryFood.name}</span>
            </div>
            <Divider />
            {foodDetailData.ingredients.length > 0 && (
              <>
                <h5 className='text-center pt-3'>Thành phần</h5>
                <div className='h-[200px] overflow-y-auto px-3'>
                  {foodDetailData.ingredients.map((item) => {
                    return (
                      <div key={item.id} className='flex items-start justify-between text-[18px] mb-2'>
                        <span className='font-semibold w-[50%] flex-shrink'>{item.name}</span>
                        <span className='font-normal text-end'>{formatPrice(item.price)}đ</span>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ModalFoodDetail
