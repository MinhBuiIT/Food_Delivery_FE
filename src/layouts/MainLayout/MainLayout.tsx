import React from 'react'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <div className='pt-[95px]'>{children}</div>
      <Footer />
    </>
  )
}

export default MainLayout
