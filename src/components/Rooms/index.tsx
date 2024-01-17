import React from 'react'

import { createRoom, database, getAllRooms, getRoomById } from '@/core/firebase'

import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { RoomConstructor } from '@/components/RoomConstructor'

import styles from './style.module.scss'
import { onChildAdded, onChildChanged, onValue, ref } from 'firebase/database'

export const Rooms: React.FC = ({ data }: any) => {
  const [rooms, setRooms] = React.useState(data)
  const [roomConstructor, setRoomConstructor] = React.useState(false)

  console.log('rooms', rooms)

  React.useEffect(() => {
    const roomsRef = ref(database, 'rooms')

    const subscribe = onValue(roomsRef, async () => {
      const newRooms = await getAllRooms()
      setRooms(newRooms)
    })

    return () => {
      subscribe()
    }
  }, [])

  return (
    <main className="main">
      <RoomConstructor isOpened={roomConstructor} onClose={() => setRoomConstructor(false)} />
      <div className={styles.rooms}>
        <div className={styles.head}>
          <h1 className={styles.title}>All Conversations</h1>
          <Button icon="plus" color="green" onClick={() => setRoomConstructor(true)}>
            Create room
          </Button>
        </div>
        <div className={styles.container}>
          {rooms &&
            rooms.map((room) => (
              <Card
                key={room.id}
                path={`/rooms/${room.id}`}
                topic={room.topic}
                type={room.type}
                members={room.members}
              />
            ))}
        </div>
      </div>
    </main>
  )
}
