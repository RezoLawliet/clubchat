import React from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'

import nookies from 'nookies'

import { Header } from '@/components/Header'
import { Rooms } from '@/components/Rooms'

import { getAllRooms, getUserById } from '@/core/firebase'
import { admin } from '@/core/firebase-admin'

export default function RoomsPage({ authUser, content }: any) {
  return (
    <div className="container">
      <Head>
        <title>ClubChat: Conversations</title>
      </Head>
      <Header authUser={authUser} />
      <Rooms authUser={authUser} content={content} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = nookies.get(context)
    const token = await admin.auth().verifyIdToken(cookies.token)
    const authUser = await getUserById(token.uid)
    if (authUser) {
      const content = await getAllRooms()
      return {
        props: {
          authUser,
          content,
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
