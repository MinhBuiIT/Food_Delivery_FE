import { useMutation } from '@tanstack/react-query'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { logoutResApi } from 'src/apis/AdminRes/auth.api'
import { MyAppAuthContext } from 'src/context/AppAuthContext'

const AdminResLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const { setIsAuthResAdmin } = useContext(MyAppAuthContext)
  const [drawer, setDrawer] = useState(false)
  const logoutMutation = useMutation({
    mutationFn: () => logoutResApi()
  })
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      setIsAuthResAdmin(false)
      navigate('/')
      toast.success('Đăng xuất thành công')
    } catch (error) {
      console.log(error)

      toast.error('Đăng xuất thất bại')
    }
  }
  return (
    <>
      <div>
        <div className='flex justify-end'>
          <button
            data-drawer-target='default-sidebar'
            data-drawer-toggle='default-sidebar'
            aria-controls='default-sidebar'
            type='button'
            className='inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 '
            onClick={() => setDrawer(!drawer)}
          >
            <span className='sr-only'>Open sidebar</span>
            <svg
              className='w-6 h-6'
              aria-hidden='true'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                clipRule='evenodd'
                fillRule='evenodd'
                d='M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z'
              />
            </svg>
          </button>
        </div>
        <aside
          id='default-sidebar'
          className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${drawer ? 'translate-x-0' : '-translate-x-full '} sm:translate-x-0`}
          aria-label='Sidebar'
        >
          <div className='h-full px-3 py-4 overflow-y-auto bg-gray-50 '>
            <ul className='space-y-2 font-medium'>
              <li>
                <Link
                  to='/admin/restaurant/dashboard'
                  className='flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100  group'
                >
                  <svg
                    className='w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 '
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='currentColor'
                    viewBox='0 0 22 21'
                  >
                    <path d='M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z' />
                    <path d='M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z' />
                  </svg>
                  <span className='ms-3'>Thông tin</span>
                </Link>
              </li>
              <li>
                <Link
                  to='/admin/restaurant/order'
                  className='flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group'
                >
                  <svg
                    className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-500'
                    xmlns='http://www.w3.org/2000/svg'
                    id='Layer_1'
                    data-name='Layer 1'
                    viewBox='0 0 24 24'
                  >
                    <path d='M19,0c-2.761,0-5,2.239-5,5s2.239,5,5,5,5-2.239,5-5S21.761,0,19,0Zm1.293,7.707l-2.293-2.293V2h2v2.586l1.707,1.707-1.414,1.414Zm-11.293,14.293c0,1.105-.895,2-2,2s-2-.895-2-2,.895-2,2-2,2,.895,2,2Zm12.835-7H5.654l.131,1.116c.059,.504,.486,.884,.993,.884h13.222v2H6.778c-1.521,0-2.802-1.139-2.979-2.649L2.215,2.884c-.059-.504-.486-.884-.993-.884H0V0H1.222c1.521,0,2.802,1.139,2.979,2.649l.041,.351H12.294c-.189,.634-.294,1.305-.294,2,0,3.866,3.134,7,7,7,1.273,0,2.462-.345,3.49-.938l-.655,3.938Zm-2.835,7c0,1.105-.895,2-2,2s-2-.895-2-2,.895-2,2-2,2,.895,2,2Z' />
                  </svg>

                  <span className='flex-1 ms-3 whitespace-nowrap'>Đơn đặt hàng</span>
                </Link>
              </li>
              <li>
                <Link
                  to='/admin/restaurant/menu'
                  className='flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group'
                >
                  <svg
                    className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 '
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z' />
                  </svg>
                  <span className='flex-1 ms-3 whitespace-nowrap'>Thực đơn</span>
                </Link>
              </li>
              <li>
                <Link
                  to='/admin/restaurant/category'
                  className='flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group'
                >
                  <svg
                    className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900 '
                    xmlns='http://www.w3.org/2000/svg'
                    id='Layer_1'
                    data-name='Layer 1'
                    viewBox='0 0 24 24'
                  >
                    <path d='m19.5,0H4.5C2.019,0,0,2.019,0,4.5v15c0,2.481,2.019,4.5,4.5,4.5h15c2.481,0,4.5-2.019,4.5-4.5V4.5c0-2.481-2.019-4.5-4.5-4.5Zm3.5,19.5c0,1.93-1.57,3.5-3.5,3.5H4.5c-1.93,0-3.5-1.57-3.5-3.5V4.5c0-1.93,1.57-3.5,3.5-3.5h15c1.93,0,3.5,1.57,3.5,3.5v15ZM9.5,3h-5c-.827,0-1.5.673-1.5,1.5v5c0,.827.673,1.5,1.5,1.5h5c.827,0,1.5-.673,1.5-1.5v-5c0-.827-.673-1.5-1.5-1.5Zm.5,6.5c0,.276-.225.5-.5.5h-5c-.275,0-.5-.224-.5-.5v-5c0-.276.225-.5.5-.5h5c.275,0,.5.224.5.5v5Zm9.5-6.5h-5c-.827,0-1.5.673-1.5,1.5v5c0,.827.673,1.5,1.5,1.5h5c.827,0,1.5-.673,1.5-1.5v-5c0-.827-.673-1.5-1.5-1.5Zm.5,6.5c0,.276-.225.5-.5.5h-5c-.275,0-.5-.224-.5-.5v-5c0-.276.225-.5.5-.5h5c.275,0,.5.224.5.5v5Zm-10.5,3.5h-5c-.827,0-1.5.673-1.5,1.5v5c0,.827.673,1.5,1.5,1.5h5c.827,0,1.5-.673,1.5-1.5v-5c0-.827-.673-1.5-1.5-1.5Zm.5,6.5c0,.276-.225.5-.5.5h-5c-.275,0-.5-.224-.5-.5v-5c0-.276.225-.5.5-.5h5c.275,0,.5.224.5.5v5Zm9.5-6.5h-5c-.827,0-1.5.673-1.5,1.5v5c0,.827.673,1.5,1.5,1.5h5c.827,0,1.5-.673,1.5-1.5v-5c0-.827-.673-1.5-1.5-1.5Zm.5,6.5c0,.276-.225.5-.5.5h-5c-.275,0-.5-.224-.5-.5v-5c0-.276.225-.5.5-.5h5c.275,0,.5.224.5.5v5Z' />
                  </svg>
                  <span className='flex-1 ms-3 whitespace-nowrap'>Loại đồ ăn</span>
                </Link>
              </li>
              <li>
                <Link
                  to='/admin/restaurant/ingredient'
                  className='flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group'
                >
                  <svg
                    className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 '
                    xmlns='http://www.w3.org/2000/svg'
                    id='Layer_1'
                    data-name='Layer 1'
                    viewBox='0 0 24 24'
                  >
                    <path d='M10.613,12.234c0,2.196,.216,4.751,1.387,4.814,.383,.021,1.439-.166,1.387-4.814-.044-3.949-.937-5.805-1.386-6.194-.45,.39-1.388,2.248-1.388,6.194Z' />
                    <path d='M8.751,16.118c-.337-1.392-.337-2.929-.337-3.884,0-5.05,1.442-8.442,3.587-8.442s3.587,3.392,3.587,8.442c0,.964,0,2.523-.348,3.927,1.018-.852,1.588-2.448,1.588-5.319,0-5.432-2.92-9.842-4.826-9.842S7.174,5.41,7.174,10.842c0,2.82,.578,4.412,1.577,5.276Z' />
                    <path d='M22.804,10.842c0-4.985-3.36-8.076-6.599-9.357,1.671,2.287,2.821,5.765,2.821,9.357,0,5.735-2.263,8.421-7.026,8.406-4.707-.015-7.026-2.75-7.026-8.406,0-3.591,1.149-7.068,2.82-9.355C4.551,2.774,1.196,5.863,1.196,10.842c0,6.133,4.085,7.851,8.106,8.278-.476,.358-.904,.745-1.266,1.332-.319,.518-.158,1.196,.359,1.515,.18,.111,.379,.163,.576,.163,.369,0,.729-.186,.937-.522,.258-.418,.626-.747,.996-1l.002,1.294c0,.607,.493,1.099,1.1,1.099h.002c.607-.001,1.099-.494,1.098-1.101l-.002-1.283c.367,.253,.732,.582,.992,.997,.322,.516,1,.671,1.516,.349,.515-.322,.671-1.001,.349-1.516-.357-.571-.742-.977-1.198-1.334,4-.439,8.041-2.171,8.041-8.271Z' />
                  </svg>

                  <span className='flex-1 ms-3 whitespace-nowrap'>Thành phần</span>
                </Link>
              </li>
              <li>
                <Link
                  to='/admin/restaurant/event'
                  className='flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group'
                >
                  <svg
                    className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900 '
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z' />
                    <path d='M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z' />
                    <path d='M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z' />
                  </svg>
                  <span className='flex-1 ms-3 whitespace-nowrap'>Sự kiện</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className='flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100  group'
                >
                  <svg
                    className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 '
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 18 16'
                  >
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3'
                    />
                  </svg>
                  <span className='flex-1 ms-3 whitespace-nowrap'>Đăng xuất</span>
                </button>
              </li>
            </ul>
          </div>
        </aside>
        <div className='p-4 sm:ml-64'>{children}</div>
      </div>
    </>
  )
}

export default AdminResLayout
