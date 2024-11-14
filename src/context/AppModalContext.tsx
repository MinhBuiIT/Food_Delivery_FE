import React, { createContext } from 'react'

type ModalContextType = {
  authModal: boolean
  setAuthModal: (value: boolean) => void
}

const initialAuthContext: ModalContextType = {
  authModal: false,
  setAuthModal: () => {}
}

export const MyAppModalContext = createContext<ModalContextType>(initialAuthContext)

const AppModalContext = ({ children }: { children: React.ReactNode }) => {
  const [authModal, setAuthModal] = React.useState<boolean>(initialAuthContext.authModal)
  return <MyAppModalContext.Provider value={{ authModal, setAuthModal }}>{children}</MyAppModalContext.Provider>
}

export default AppModalContext
