import Footer from 'src/components/Footer'
import HeaderSimple from 'src/components/HeaderSimple'

const OrderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <HeaderSimple />
      {children}
      <Footer />
    </>
  )
}

export default OrderLayout
