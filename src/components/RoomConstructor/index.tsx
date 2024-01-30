import React from 'react'
import { useRouter } from 'next/router'

import cn from 'classnames'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ReactHtmlParser from 'react-html-parser'

import { MdError } from 'react-icons/md'
import { BiWorld, BiShieldQuarter } from 'react-icons/bi'
import { IoClose as CloseButton } from 'react-icons/io5'

import { Modal } from '@/components/Modal'
import { Button } from '@/components/Button'
import { RoomType, UserType } from '@/components/Room'

import styles from './style.module.scss'

import { createRoom } from '@/core/firebase'

const types = [
  {
    destination: 'public',
    icon: <BiWorld />,
    description: `A <b>public</b> destination will makes your room becomes open to join
  <b>everyone</b>`,
  },
  {
    destination: 'private',
    icon: <BiShieldQuarter />,
    description: `A <b>private</b> destination will makes your room becomes open to join by persons with a
  <b>key</b>`,
  },
]

interface IRoomConstructor {
  user: UserType
  room?: RoomType
  isOpened: boolean
  onClose: () => void
}

export const RoomConstructor: React.FC<IRoomConstructor> = ({ user, room, isOpened, onClose }) => {
  const router = useRouter()
  const [topic, setTopic] = React.useState(room?.topic || '')
  const [type, setType] = React.useState(
    types.findIndex((type) => type.destination === room?.type) !== -1
      ? types.findIndex((type) => type.destination === room?.type)
      : 0
  )
  const [error, setError] = React.useState('')
  const [loader, setLoader] = React.useState(false)

  const generateSecretKey = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    const length = 32
    let key = ''
    for (var i = 0; i < length; i++) {
      var rnum = Math.floor(Math.random() * chars.length)
      key += chars.substring(rnum, rnum + 1)
    }
    return key
  }

  const validate = () => {
    if (topic.trim().length < 4) {
      setError('Topic must be at least 4 characters')
      return false
    } else {
      setError('')
      return true
    }
  }

  const update = async () => {
    if (validate()) {
      setLoader(true)
      const timestamp = Date.now()
      try {
        await createRoom(room?.id, {
          topic,
          type: types[type].destination,
          ...(type === 1 && { key: String(generateSecretKey()) }),
          timestamp,
        })
        onClose()
      } catch (error) {
        console.error(error)
        toast.error('Error until the creation room', {
          position: 'top-center',
          autoClose: 7000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        })
      }
      setLoader(false)
    }
  }

  const create = async () => {
    if (validate()) {
      setLoader(true)
      const id = String(uuidv4())
      const timestamp = Date.now()
      try {
        await createRoom(id, {
          topic,
          ruler: user.id,
          type: types[type].destination,
          ...(type === 1 && { key: String(generateSecretKey()) }),
          timestamp,
        })
        router.push(`/rooms/${id}`)
      } catch (error) {
        console.error(error)
        toast.error('Error until the creation room', {
          position: 'top-center',
          autoClose: 7000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        })
      }
      setLoader(false)
    }
  }

  return (
    <Modal isOpened={isOpened} onClose={onClose}>
      <div className={styles.block}>
        <div className={styles.settings}>
          <div className={styles.general}>
            <span className={styles.option}>Topic</span>
            <input
              className={cn(styles.input, { [styles.error]: error })}
              type="text"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              autoComplete="off"
              placeholder="Enter the topic to be discussed"
            />
            {error && (
              <span className={styles.notification}>
                <MdError className="w-5 h-5" />
                {error}
              </span>
            )}
          </div>
          <div className={styles.details}>
            <span className={styles.option}>Destination</span>
            <div className={styles.types}>
              {types.map((item, index) => (
                <button
                  className={cn(styles.card, { [styles.selected]: type === index })}
                  key={index}
                  onClick={() => setType(index)}
                >
                  {React.cloneElement(item.icon, { className: styles.icon })}
                  <span>
                    {item.destination.charAt(0).toUpperCase() + item.destination.slice(1)}
                  </span>
                </button>
              ))}
            </div>
            <p className={styles.description}>{ReactHtmlParser(types[type].description)}</p>
          </div>
          {room ? (
            <Button disabled={loader} onClick={update}>
              Save changes
            </Button>
          ) : (
            <Button color="green" disabled={loader} onClick={create}>
              Create room
            </Button>
          )}
        </div>
        <CloseButton className={styles.close} onClick={onClose} />
      </div>
    </Modal>
  )
}
