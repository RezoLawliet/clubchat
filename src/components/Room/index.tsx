import React from 'react'
import { useRouter } from 'next/router'

import cn from 'classnames'

import { IoMdMore } from 'react-icons/io'
import { AiOutlineArrowUp } from 'react-icons/ai'
import { MdOutlineAttachFile } from 'react-icons/md'

import { Empty } from '@/components/Empty'
import { Message } from '@/components/Message'
import { RoomInfo } from '@/components/RoomInfo'
import { AreYouSure } from '@/components/AreYouSure'
import { RoomConstructor } from '@/components/RoomConstructor'

import styles from './style.module.scss'

import UserType from '@/core/models/UserModel'
import RoomType from '@/core/models/RoomModel'

import { ref, onValue } from 'firebase/database'
import { database, getRoomById, setImageFile } from '@/core/firebase'
import { createMessage, leaveRoom } from '@/core/controllers/RoomController'

interface IRoom {
  authUser: UserType
  content: RoomType
}

export const Room: React.FC<IRoom> = ({ authUser, content }) => {
  const router = useRouter()
  const [room, setRoom] = React.useState(content)
  const [isPopup, setIsPopup] = React.useState(false)
  const [isInfo, setIsInfo] = React.useState(false)
  const [isEdit, setIsEdit] = React.useState(false)
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
        const response = await getRoomById(room.id)
        setRoom(response)
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
      if (file && file.type.startsWith('image/')) {
        const url = await setImageFile(room.id, file)
        if (url) {
          await createMessage(room.id, authUser.id, url, 'imageUrl')
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onSend = async () => {
    try {
      const value = enterRef.current?.value
      if (value) {
        await createMessage(room.id, authUser.id, value, null)
        enterRef.current.value = ''
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main className="main">
      {isInfo && (
        <RoomInfo user={authUser} room={room} isOpened={isInfo} onClose={() => setIsInfo(false)} />
      )}
      {isEdit && (
        <RoomConstructor
          user={authUser}
          room={room}
          isOpened={isEdit}
          onClose={() => setIsEdit(false)}
        />
      )}
      {isExit && (
        <AreYouSure
          topic="Do you really wanna leave?"
          action="Leave"
          isOpened={isExit}
          onClose={() => setIsExit(false)}
          onSubmit={async () => {
            await leaveRoom(room.id, authUser.id)
            router.push('/rooms')
          }}
        />
      )}
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
                <li className={styles.option} onClick={() => setIsInfo(true)}>
                  Information
                </li>
                {authUser.id === room.ruler.id && (
                  <li className={styles.option} onClick={() => setIsEdit(true)}>
                    Settings
                  </li>
                )}
                <li className={cn(styles.option, 'text-red-500')} onClick={() => setIsExit(true)}>
                  Leave
                </li>
              </ul>
            </button>
          </div>
        </div>
        <div className={styles.chat}>
          <div className={styles.messages} ref={chatRef}>
            {room.messages &&
              room.messages.map((message) => (
                <React.Fragment key={message.timestamp}>
                  <Message key={message.timestamp} user={authUser} message={message} />
                </React.Fragment>
              ))}
            {room.messages && room.messages.every((message) => message.type === 'notification') && (
              <Empty
                className="mt-32"
                emoji="👏"
                title="No messages here"
                description="Be first to send a new message to the chat."
              />
            )}
          </div>
        </div>
        <div className={styles.form}>
          <input
            className={styles.input}
            ref={enterRef}
            onKeyDown={(event) => event.key === 'Enter' && onSend()}
            type="text"
            placeholder="Enter message..."
          />
          <input
            id="file"
            ref={fileRef}
            onChange={onUpload}
            type="file"
            accept=".jpg, .jpeg, .png, .svg"
            hidden
          />
          <button className={styles.submit} type="button" onClick={onSend}>
            <AiOutlineArrowUp className="w-5 h-full" />
          </button>
          <label className={styles.attach} htmlFor="file">
            <MdOutlineAttachFile className="w-5 h-full" />
          </label>
        </div>
      </div>
    </main>
  )
}
