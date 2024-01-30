import React from 'react'
import { GetServerSideProps } from 'next'

import nookies from 'nookies'

import { Header } from '@/components/Header'
import { User } from '@/components/User'

import { getUserById } from '@/core/firebase'
import { admin } from '@/core/firebase-admin'

export default function UserPage({ authUser, contentUser }: any) {
  return (
    <div className="container">
      <Header authUser={authUser} />
      <User authUser={authUser} contentUser={contentUser} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const id = context.query.id
    const cookies = nookies.get(context)
    const token = await admin.auth().verifyIdToken(cookies.token)
    const authUser = await getUserById(token.uid)
    if (authUser) {
      const contentUser = await getUserById(id)
      return {
        props: {
          authUser,
          contentUser,
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
