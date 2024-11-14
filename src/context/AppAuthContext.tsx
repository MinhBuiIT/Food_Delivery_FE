import React, { createContext } from 'react'
import UserProfile from 'src/types/UserProfile'
import { getItem } from 'src/utils/localStorage'

type AuthContextType = {
  profile: UserProfile | null
  profileOwner: UserProfile | null
  setProfile: (profile: UserProfile | null) => void
  setProfileOwner: (profile: UserProfile | null) => void
  isAuth: boolean
  setIsAuth: (value: boolean) => void
  isAuthResAdmin: boolean
  setIsAuthResAdmin: (value: boolean) => void
  restaurantId: number | null
  setRestaurantId: (id: number) => void
}

const initialAuthContext: AuthContextType = {
  profile: getItem('profile') || null,
  profileOwner: getItem('profileOwner') || null,
  setProfile: () => {},
  setProfileOwner: () => {},
  isAuth: !!getItem('accessToken'),
  setIsAuth: () => {},
  isAuthResAdmin: !!getItem('accessTokenRes'),
  setIsAuthResAdmin: () => {},
  restaurantId: getItem('restaurantId') || null,
  setRestaurantId: () => {}
}

export const MyAppAuthContext = createContext<AuthContextType>(initialAuthContext)

const AppAuthContext = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = React.useState<UserProfile | null>(initialAuthContext.profile)
  const [isAuth, setIsAuth] = React.useState<boolean>(initialAuthContext.isAuth)
  const [restaurantId, setRestaurantId] = React.useState<number | null>(initialAuthContext.restaurantId)
  const [isAuthResAdmin, setIsAuthResAdmin] = React.useState<boolean>(initialAuthContext.isAuthResAdmin)
  const [profileOwner, setProfileOwner] = React.useState<UserProfile | null>(initialAuthContext.profileOwner)
  return (
    <MyAppAuthContext.Provider
      value={{
        profile,
        setProfile,
        isAuth,
        setIsAuth,
        isAuthResAdmin,
        setIsAuthResAdmin,
        profileOwner,
        setProfileOwner,
        restaurantId,
        setRestaurantId
      }}
    >
      {children}
    </MyAppAuthContext.Provider>
  )
}

export default AppAuthContext
