import React from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'

import nookies from 'nookies'

import { Identification } from '@/components/GetStarted/Identification'
import { Customization } from '@/components/GetStarted/Customization'
import { Verification } from '@/components/GetStarted/Verification'

import { getUserById } from '@/core/firebase'
import { admin } from '@/core/firebase-admin'

const steps: any = {
  0: Identification,
  1: Customization,
  2: Verification,
}

type UserType = {
  fullname: string
  username?: string
  imageUrl?: File | string
  phone: string
}

type AuthType = {
  user: UserType
  setUser?: React.Dispatch<React.SetStateAction<UserType>>
  setUserProps: (props: keyof UserType, value: File | string) => void
  onNextStep: () => void
  onPrevStep: () => void
}

export const AuthCloud = React.createContext<AuthType>({} as AuthType)

export default function AuthPage() {
  const [step, setStep] = React.useState(0)
  const [user, setUser] = React.useState<UserType>({
    fullname: '',
    phone: '',
  })

  const Step = steps[step]

  const onNextStep = () => {
    setStep((prev) => prev + 1)
  }

  const onPrevStep = () => {
    setStep((prev) => prev - 1)
  }

  const setUserProps = (key: keyof UserType, value: File | string) => {
    setUser((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <>
      <Head>
        <title>Clubhouse: Get Started</title>
      </Head>
      <AuthCloud.Provider value={{ onNextStep, onPrevStep, user, setUser, setUserProps }}>
        <Step />
      </AuthCloud.Provider>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = nookies.get(context)
    const token = await admin.auth().verifyIdToken(cookies.token)
    const user = await getUserById(token.uid)
    if (user) {
      return {
        redirect: {
          destination: '/rooms',
          permanent: false,
        },
      }
    } else {
      return {
        props: {},
      }
    }
  } catch (error) {
    console.error(error)
    return {
      props: {},
    }
  }
}
