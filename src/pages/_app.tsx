import type { AppProps } from 'next/app'

import { AuthProvider } from '@/components/AuthProvider'

import '@/styles/main.scss'
import '@/core/firebase'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
