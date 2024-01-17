import React from 'react'
import { GetServerSideProps } from 'next'

import nookies from 'nookies'

import { Header } from '@/components/Header'
import { User } from '@/components/User'

import { getUserById } from '@/core/firebase'
import { admin } from '@/core/firebase-admin'

export default function UserPage({ user }: any) {
  return (
    <div className="container">
      <Header {...user} />
      <User {...user} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = nookies.get(context)
    const token = await admin.auth().verifyIdToken(cookies.token)
    const user = await getUserById(token.uid)
    if (user) {
      return {
        props: {
          user,
        },
      }
    } else {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }
  } catch (error) {
    console.error(error)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}
