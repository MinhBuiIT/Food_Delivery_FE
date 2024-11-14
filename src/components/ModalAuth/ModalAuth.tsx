import { useState } from 'react'
import Login from '../Login'
import Register from '../Register'

const ModalAuth = () => {
  const [isLogin, setIsLogin] = useState(true)
  return (
    <div className='w-[400px] h-auto bg-white rounded-md shadow py-5 px-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
      <h3 className='text-black text-[24px] font-semibold'>{isLogin ? 'Đăng Nhập' : 'Đăng Ký'}</h3>
      {isLogin ? <Login /> : <Register />}
      <div className='flex items-center mt-3 text-[16px]'>
        <div>{isLogin ? 'Bạn chưa có tài khoản?' : 'Đã có tài khoản'}</div>
        <button className='text-orange-500 font-semibold ml-1' onClick={() => setIsLogin(!isLogin)}>
          {!isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
        </button>
      </div>
    </div>
  )
}

export default ModalAuth
