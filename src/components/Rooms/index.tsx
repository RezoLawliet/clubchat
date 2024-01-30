import React from 'react'

import { BsKeyFill } from 'react-icons/bs'
import { BsEmojiAstonished } from 'react-icons/bs'

import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { RoomConstructor } from '@/components/RoomConstructor'
import { RoomFinder } from '@/components/RoomFinder'

import styles from './style.module.scss'

import { ref, onValue } from 'firebase/database'
import { database, getAllRooms } from '@/core/firebase'
import { Loader } from '../Loader'
import { Empty } from '../Empty'

interface IRooms {
  authUser: {
    id: string
    fullname: string
    username: string
    imageUrl?: string
  }
  content: any[] | null
}

export const Rooms: React.FC<IRooms> = ({ authUser, content }) => {
  const [rooms, setRooms] = React.useState(content)
  const [roomConstructor, setRoomConstructor] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const onSearch = (data: any[] | null) => {
    setIsLoading(true)
    const collection: any[] = []
    data &&
      data.forEach((roomSnapshot) => {
        const room = roomSnapshot
        if (
          String(room.id.toLowerCase()) === String(search.toLowerCase()) ||
          room.topic.toLowerCase().includes(search.toLowerCase())
        ) {
          collection.push(room)
          setRooms(collection)
        }
      })
    setIsLoading(false)
  }

  React.useEffect(() => {
    const roomsRef = ref(database, 'rooms')

    const subscribe = onValue(roomsRef, async () => {
      const response = await getAllRooms()
      if (search) {
        onSearch(response)
      } else {
        setRooms(response)
      }
    })

    return () => {
      subscribe()
    }
  }, [search])

  return (
    <main className="main">
      {roomConstructor && (
        <RoomConstructor
          user={authUser}
          isOpened={roomConstructor}
          onClose={() => setRoomConstructor(false)}
        />
      )}
      <div className={styles.rooms}>
        <div className={styles.head}>
          <h1 className={styles.title}>All Conversations</h1>
          <div className={styles.controls}>
            <RoomFinder search={search} setSearch={setSearch} />
            <Button icon="plus" color="green" onClick={() => setRoomConstructor(true)}>
              Create room
            </Button>
          </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : !rooms ? (
          <Empty
            className="mt-32"
            emoji="😩"
            title="No rooms here"
            description="Unfortunately, nothing was found by your request."
          />
        ) : (
          <div className={styles.container}>
            {rooms.map((room: any) => (
              <Card
                key={room.id}
                path={`/rooms/${room.id}`}
                topic={room.topic}
                type={room.type}
                members={room.members}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
