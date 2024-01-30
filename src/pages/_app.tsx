import type { AppProps } from 'next/app'

import NextNProgress from 'nextjs-progressbar'
import { ToastContainer } from 'react-toastify'

import { AuthProvider } from '@/components/AuthProvider'

import '@/styles/main.scss'
import '@/core/firebase'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ToastContainer />
      <NextNProgress
        color="#00BFFF"
        startPosition={0.3}
        stopDelayMs={100}
        height={2.5}
        showOnShallow={true}
      />
      <Component {...pageProps} />
    </AuthProvider>
  )
}
