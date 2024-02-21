import React from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'

import nookies from 'nookies'

import { Header } from '@/components/Header'
import { Room } from '@/components/Room'
import { RoomAccess } from '@/components/RoomAccess'

import { getUserById } from '@/core/controllers/UserController'
import { getRoomById, joinRoom } from '@/core/controllers/RoomController'

import { admin } from '@/core/firebase-admin'

export default function RoomPage({ authUser, room }: any) {
  const [isPrivate, setIsPrivate] = React.useState(room.type === 'private')

  return (
    <>
      <Head>
        <title>{room.topic}</title>
      </Head>
      <div className="container">
        <Header authUser={authUser} />
        {isPrivate && !room.members.some((member: any) => member.id === authUser.id) ? (
          <RoomAccess user={authUser} content={room} setIsPrivate={setIsPrivate} />
        ) : (
          <Room authUser={authUser} content={room} />
        )}
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const id = context.query.id
    const cookies = nookies.get(context)
    const token = await admin.auth().verifyIdToken(cookies.token)
    const authUser = await getUserById(token.uid)
    if (authUser) {
      const room = await getRoomById(id)
      if (room.type === 'private' && token.uid === room.ruler.id) {
        await joinRoom(id, token.uid, room.key)
      } else if (room.type === 'public') {
        await joinRoom(id, token.uid)
      }
      const content = await getRoomById(id)
      return {
        props: {
          authUser: {
            id: token.uid,
            ...authUser,
          },
          room: {
            id,
            ...content,
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
