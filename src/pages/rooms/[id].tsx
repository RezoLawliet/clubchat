import React from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'

import nookies from 'nookies'

import { Header } from '@/components/Header'
import { Room } from '@/components/Room'

import { getRoomById, getUserById, joinRoom } from '@/core/firebase'
import { admin } from '@/core/firebase-admin'
import { EnterRoomKey } from '@/components/EnterRoomKey'
import { useParams } from 'next/navigation'

export default function RoomPage({ user, room }: any) {
  const { id } = useParams()
  const [isPrivate, setIsPrivate] = React.useState(room.type === 'private')

  return (
    <>
      <Head>
        <title>{room.topic}</title>
      </Head>
      <div className="container">
        <Header {...user} />
        {isPrivate && !room.members.some((member) => member.id === user.id) ? (
          <EnterRoomKey user={user} room={id} setIsPrivate={setIsPrivate} />
        ) : (
          <Room user={user} data={room} />
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
    const user = await getUserById(token.uid)
    if (user) {
      const room = await getRoomById(id)
      if (room.type === 'private' && token.uid === room.ruler) {
        await joinRoom(id, token.uid, room.key)
      } else if (room.type === 'public') {
        await joinRoom(id, token.uid)
      }
      const newRoom = await getRoomById(id)
      return {
        props: {
          user: {
            id: token.uid,
            ...user,
          },
          room: {
            id,
            ...newRoom,
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
