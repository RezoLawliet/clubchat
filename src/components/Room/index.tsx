import React from 'react'
import { useRouter } from 'next/router'

import cn from 'classnames'

import { IoIosAttach } from 'react-icons/io'
import { MdSettings } from 'react-icons/md'
import { AiOutlineArrowUp } from 'react-icons/ai'
import { IoMdMore } from 'react-icons/io'

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
import { RoomInfo } from '../RoomInfo'

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
  const [room, setRoom] = React.useState(data)
  const [isPopup, setIsPopup] = React.useState(false)
  const [isInfo, setIsInfo] = React.useState(false)
  const [isExit, setIsExit] = React.useState(false)

  const chatRef = React.useRef<HTMLDivElement>(null)
  const fileRef = React.useRef<HTMLInputElement>(null)
  const enterRef = React.useRef<HTMLInputElement>(null)

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
      <RoomInfo room={room} isOpened={isInfo} onClose={() => setIsInfo(false)} />
      <RoomLeave
        isOpened={isExit}
        onClose={() => setIsExit(false)}
        onLeave={async () => {
          await leaveRoom(room.id, user.id)
          router.push('/rooms')
        }}
      />
      <div className={styles.room}>
        <div className={styles.head}>
          <h1 className={styles.title}>{room.topic}</h1>
          <div className={styles.controls}>
            <button
              className={cn(styles.settings, { [styles.opened]: isPopup })}
              onClick={() => setIsPopup(!isPopup)}
            >
              <IoMdMore className={styles.settingsIcon} />
              <ul className={cn(styles.popup, { [styles.opened]: isPopup })}>
                <li className={styles.option}>
                  <button onClick={() => setIsInfo(true)}>Information</button>
                </li>
                <li className={styles.option}>
                  <button>Settings</button>
                </li>
                <li className={cn(styles.option, 'text-red-500')}>
                  <button onClick={() => setIsExit(true)}>Leave</button>
                </li>
              </ul>
            </button>
          </div>
        </div>
        <div className={styles.chat}>
          <div className={styles.messages} ref={chatRef}>
            {room.messages.map((message, index) => (
              <React.Fragment key={message.timestamp}>
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
