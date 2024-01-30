import React from 'react'

import nookies from 'nookies'

import { auth } from '@/core/firebase'

const AuthStorage = React.createContext<{ user: any }>({
  user: null,
})

interface IAuthProvider {
  children: React.ReactNode
}

export const AuthProvider: React.FC<IAuthProvider> = ({ children }) => {
  const [user, setUser] = React.useState<any>(null)

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
