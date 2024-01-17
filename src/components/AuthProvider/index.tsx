import React from 'react'
import { useRouter } from 'next/router'

import nookies from 'nookies'

import { auth } from '@/core/firebase'

const AuthStorage = React.createContext<{ user: any }>({
  user: null,
})

export const AuthProvider = ({ children }: any) => {
  const router = useRouter()
  const [user, setUser] = React.useState<any>(null)

  console.log('AuthProvider:', user)

  React.useEffect(() => {
    return auth.onIdTokenChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken()
        setUser(user)
        nookies.set(undefined, 'token', token, { path: '/' })
      } else {
        setUser(null)
        nookies.set(undefined, 'token', '', { path: '/' })
      }
    })
  }, [])

  return <AuthStorage.Provider value={{ user }}>{children}</AuthStorage.Provider>
}
