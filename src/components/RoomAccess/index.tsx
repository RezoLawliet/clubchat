import React from 'react'
import { useRouter } from 'next/router'

import { Button } from '@/components/Button'

import styles from './style.module.scss'

import { database, getRoomById, joinRoom } from '@/core/firebase'
import { onValue, ref } from 'firebase/database'

export const RoomAccess = ({ user, content, setIsPrivate }: any) => {
  const router = useRouter()
  const [room, setRoom] = React.useState(content)
  const [key, setKey] = React.useState('')

  const confirm = async () => {
    try {
      await joinRoom(room.id, user.id, key)
      const content = await getRoomById(room.id)
      if (content && content.members.some((member: any) => member.id === user.id)) {
        setIsPrivate(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main className="main mb-24">
      <div className={styles.block}>
        <div className={styles.head}>
          <img className={styles.emoji} src="/static/shield.svg" alt="Emoji" />
          <h5 className={styles.title}>Woops!</h5>
          <p className={styles.description}>
            Looks like we fortuned into private room
            <br />
            Enter a confirmation key received from the owner
          </p>
        </div>
        <input
          className={styles.input}
          type="text"
          value={key}
          onChange={(event) => setKey(event.target.value)}
          autoComplete="off"
          placeholder="Enter room's key"
        />
        <div className={styles.navbar}>
          <Button color="white" icon="prev" onClick={() => router.back()}>
            Back
          </Button>
          <Button onClick={confirm}>Enter</Button>
        </div>
      </div>
    </main>
  )
}
