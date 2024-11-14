import { useContext } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { MyAppAuthContext } from './context/AppAuthContext'
import AdminResLayout from './layouts/AdminResLayout'
import MainLayout from './layouts/MainLayout'
import OrderLayout from './layouts/OrderLayout'
import Category from './pages/AdminRestaurant/Category'
import CreateRestaurant from './pages/AdminRestaurant/CreateRestaurant'
import Dashboard from './pages/AdminRestaurant/Dashboard'
import Event from './pages/AdminRestaurant/Event'
import Ingredient from './pages/AdminRestaurant/Ingredient'
import Menu from './pages/AdminRestaurant/Menu'
import Order from './pages/AdminRestaurant/Order'
import Home from './pages/Home'
import MyFavorites from './pages/MyFavorites'
import MyOrders from './pages/MyOrders'
import OrderPayment from './pages/OrderPayment'
import Restaurant from './pages/Restaurant'
import RestaurantDetail from './pages/RestaurantDetail'
import ReviewOrder from './pages/ReviewOrder'

const ProtectRouter = () => {
  const { isAuth } = useContext(MyAppAuthContext)

  return isAuth ? <Outlet /> : <Navigate to='/' state={{ pleaseLogin: true }} />
}
const ProtectAdminRouter = () => {
  const { isAuthResAdmin } = useContext(MyAppAuthContext)
  return isAuthResAdmin ? <Outlet /> : <Navigate to='/' state={{ pleaseLogin: true }} />
}
// const RejectRouter = () => {
//   const { isAuth } = useContext(MyAppAuthContext)

//   return !isAuth ? <Outlet /> : <Navigate to='/' />
// }
function App() {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
      <Route
        path='/restaurant'
        element={
          <MainLayout>
            <Restaurant />
          </MainLayout>
        }
      />
      <Route path='/' element={<ProtectRouter />}>
        <Route
          path='/detail/:name/:id'
          element={
            <MainLayout>
              <RestaurantDetail />
            </MainLayout>
          }
          index={true}
        />
      </Route>
      <Route path='/' element={<ProtectRouter />}>
        <Route
          path='/order/review'
          element={
            <OrderLayout>
              <ReviewOrder />
            </OrderLayout>
          }
          index={true}
        />
      </Route>
      <Route path='/' element={<ProtectRouter />}>
        <Route
          path='/my-order'
          element={
            <MainLayout>
              <MyOrders />
            </MainLayout>
          }
          index={true}
        />
      </Route>
      <Route path='/' element={<ProtectRouter />}>
        <Route
          path='/my-favorites'
          element={
            <MainLayout>
              <MyFavorites />
            </MainLayout>
          }
          index={true}
        />
      </Route>
      <Route path='/' element={<ProtectRouter />}>
        <Route path='/order/payment' element={<OrderPayment />} index={true} />
      </Route>
      <Route path='/admin/restaurant' element={<ProtectAdminRouter />}>
        <Route path='create' element={<CreateRestaurant />}></Route>
        <Route
          path='dashboard'
          element={
            <AdminResLayout>
              <Dashboard />
            </AdminResLayout>
          }
        ></Route>
        <Route
          path='order'
          element={
            <AdminResLayout>
              <Order />
            </AdminResLayout>
          }
        ></Route>
        <Route
          path='menu'
          element={
            <AdminResLayout>
              <Menu />
            </AdminResLayout>
          }
        ></Route>
        <Route
          path='category'
          element={
            <AdminResLayout>
              <Category />
            </AdminResLayout>
          }
        ></Route>
        <Route
          path='ingredient'
          element={
            <AdminResLayout>
              <Ingredient />
            </AdminResLayout>
          }
        ></Route>
        <Route
          path='event'
          element={
            <AdminResLayout>
              <Event />
            </AdminResLayout>
          }
        ></Route>
      </Route>

      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  )
}

export default App
