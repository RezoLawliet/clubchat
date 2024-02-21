import React from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'

import nookies from 'nookies'

import { Welcome } from '@/components/GetStarted/Welcome'

import { getUserById } from '@/core/firebase'
import { admin } from '@/core/firebase-admin'

export default function HomePage() {
  return (
    <>
      <Head>
        <title>ClubChat: Drop-in web-messanger</title>
      </Head>
      <Welcome />
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
