import React from 'react'

import { Button } from '@/components/Button'

import styles from './style.module.scss'
import { joinRoom } from '@/core/firebase'

export const EnterRoomKey = ({ user, room, setIsPrivate }: any) => {
  const [key, setKey] = React.useState('')

  const confirm = async () => {
    await joinRoom(room, user.id, key)
    setIsPrivate(false)
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
          <Button color="white" icon="prev">
            Back
          </Button>
          <Button onClick={confirm}>Enter</Button>
        </div>
      </div>
    </main>
  )
}
