import React from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'

import nookies from 'nookies'

import { Header } from '@/components/Header'
import { Rooms } from '@/components/Rooms'

import { onChildAdded, onChildChanged, onValue, ref } from 'firebase/database'
import { database, getAllRooms, getUserById } from '@/core/firebase'
import { admin } from '@/core/firebase-admin'

export default function RoomsPage({ rooms = [], user }: any) {
  return (
    <div className="container">
      <Head>
        <title>Clubhouse: Conversations</title>
      </Head>
      <Header {...user} />
      <Rooms data={rooms} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = nookies.get(context)
    const token = await admin.auth().verifyIdToken(cookies.token)
    const user = await getUserById(token.uid)
    if (user) {
      const rooms = await getAllRooms()
      return {
        props: {
          user,
          rooms,
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
