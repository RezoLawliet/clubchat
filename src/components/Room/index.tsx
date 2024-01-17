import React from 'react'
import { useRouter } from 'next/router'

import { IoIosAttach } from 'react-icons/io'

import { AiOutlineArrowUp } from 'react-icons/ai'

import { Button } from '@/components/Button'

import styles from './style.module.scss'
import { get, onValue, orderByKey, query, ref, serverTimestamp, set } from 'firebase/database'
import {
  database,
  getRoomById,
  getSendersByRoom,
  leaveRoom,
  sendChatMessage,
  setImageFile,
} from '@/core/firebase'
import { useParams } from 'next/navigation'
import { Avatar } from '../Avatar'
import { Message } from '@/components/Message'
import { RoomLeave } from '@/components/RoomLeave'

interface IUser {
  id: string
  fullname: string
  username: string
  imageUrl?: string
}

interface IMessage {
  owner: IUser
  message: string
  type?: string
  timestamp: number
}

interface IRoom {
  user: IUser
  data: {
    id: string
    topic: string
    type: string
    members: IUser[]
    messages: IMessage[]
  }
}

export const Room: React.FC<IRoom> = ({ user, data }) => {
  const router = useRouter()
  const [exit, setExit] = React.useState(false)
  const [room, setRoom] = React.useState(data)
  const [prevTimestamp, setPrevTimestamp] = React.useState(
    new Date(data.messages[0].timestamp).toLocaleDateString()
  )

  const chatRef = React.useRef<HTMLDivElement>(null)
  const fileRef = React.useRef<HTMLInputElement>(null)
  const enterRef = React.useRef<HTMLInputElement>(null)

  console.log('room', room)
  console.log(prevTimestamp)

  React.useEffect(() => {
    const roomRef = ref(database, `rooms/${room.id}`)
    const subscribe = onValue(roomRef, async (snapshot) => {
      try {
        if (!snapshot.exists()) {
          router.replace('/rooms')
          return
        }
        const newRooms = await getRoomById(room.id)
        setRoom(newRooms)
      } catch (error) {
        console.error(error)
      }
    })
    return () => {
      subscribe()
    }
  }, [])

  React.useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
    if (room.messages.length > 0) {
      setPrevTimestamp(
        new Date(room.messages[room.messages.length - 1].timestamp).toLocaleDateString()
      )
    }
  }, [room.messages])

  const onUpload = async () => {
    try {
      const file = fileRef.current?.files && fileRef.current.files[0]
      if (file) {
        const url = await setImageFile(room.id, file)
        await sendChatMessage(room.id, user.id, url, 'imageUrl')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onSend = async () => {
    try {
      const value = enterRef.current?.value
      if (value) {
        await sendChatMessage(room.id, user.id, value)
        enterRef.current.value = ''
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main className="main">
      <RoomLeave
        isOpened={exit}
        onClose={() => setExit(false)}
        onLeave={async () => {
          await leaveRoom(room.id, user.id)
          router.push('/rooms')
        }}
      />
      <div className={styles.room}>
        <div className={styles.head}>
          <h1 className={styles.title}>{room.topic}</h1>
          <div className={styles.control}>
            <Button icon="exit" color="red" onClick={() => setExit(true)}>
              Leave
            </Button>
          </div>
        </div>
        <div className={styles.chat}>
          <div className={styles.messages} ref={chatRef}>
            {room.messages.map((message, index) => (
              <React.Fragment key={message.timestamp}>
                {index === 0 ||
                prevTimestamp !== new Date(message.timestamp).toLocaleDateString() ? (
                  <span className={styles.separator}>
                    {new Date(message.timestamp).toLocaleDateString([], {
                      day: 'numeric',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </span>
                ) : null}
                <Message key={message.timestamp} user={user} {...message} />
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className={styles.form}>
          <input
            className={styles.input}
            ref={enterRef}
            onKeyDown={(event) => event.key === 'Enter' && onSend()}
            type="text"
            placeholder="Enter message"
          />
          <input
            id="file"
            ref={fileRef}
            onChange={onUpload}
            type="file"
            accept=".jpg, .jpeg, .png, .svg"
            hidden
          />
          <label className={styles.attach} htmlFor="file">
            <IoIosAttach className="w-5 h-full" />
          </label>
          <button className={styles.submit} type="button" onClick={onSend}>
            <AiOutlineArrowUp className="w-5 h-full" />
          </button>
        </div>
      </div>
    </main>
  )
}
