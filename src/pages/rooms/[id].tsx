import React from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'

import nookies from 'nookies'

import { Header } from '@/components/Header'
import { Room } from '@/components/Room'

import { getRoomById, getUserById, joinRoom } from '@/core/firebase'
import { admin } from '@/core/firebase-admin'

export default function RoomPage({ user, room }: any) {
  return (
    <>
      <Head>
        <title>{room.topic}</title>
      </Head>
      <div className="container">
        <Header {...user} />
        <Room data={room} user={user} />
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const id = context.query.id
    const cookies = nookies.get(context)
    const token = await admin.auth().verifyIdToken(cookies.token)
    const user = await getUserById(token.uid)
    if (user) {
      await joinRoom(id, token.uid)
      const room = await getRoomById(id)
      return {
        props: {
          user: {
            id: token.uid,
            ...user,
          },
          room: {
            id,
            ...room,
          },
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
        destination: '/rooms',
        permanent: false,
      },
    }
  }
}
