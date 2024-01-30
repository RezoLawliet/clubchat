import React from 'react'
import { useRouter } from 'next/router'

import { getRoomById } from '@/core/firebase'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { IoClose as CloseButton } from 'react-icons/io5'

import { Modal } from '@/components/Modal'
import { Button } from '@/components/Button'
import { UserType, RoomType } from '@/components/Room'

import styles from './style.module.scss'

interface IRoomInfo {
  user: UserType
  room: RoomType
  isOpened: boolean
  onClose: () => void
}

export const RoomInfo: React.FC<IRoomInfo> = ({ user, room, isOpened, onClose }) => {
  const router = useRouter()
  const [uuid, setUuid] = React.useState('')
  const [loader, setLoader] = React.useState(false)

  const create = async () => {
    setLoader(true)
    try {
      const room = await getRoomById(uuid)
      if (room) {
        router.push(`/rooms/${uuid}`)
      } else {
        toast.error('Error until the find room', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        })
      }
    } catch (error) {
      console.error(error)
      toast.error('Error until the deleting room', {
        position: 'top-center',
        autoClose: 3000,
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

  return (
    <Modal isOpened={isOpened} onClose={onClose}>
      <div className={styles.block}>
        <div className={styles.settings}>
          <div className={styles.definition}>
            <span className={styles.option}>General</span>
            <ul className={styles.info}>
              <li className={styles.tag}>
                <span>Topic</span>
                <p>{room.topic}</p>
              </li>
              <li className={styles.tag}>
                <span>Ruler</span>
                <p>@{room.ruler.username}</p>
              </li>
              {room.key && (
                <li className={styles.tag}>
                  <span>Secret Key*</span>
                  <p>{room.key}</p>
                </li>
              )}
            </ul>
          </div>
          <div className={styles.definition}>
            <span className={styles.option}>Secondary</span>
            <ul className={styles.info}>
              <ul className="grid grid-cols-2">
                <li className={styles.tag}>
                  <span>Destination</span>
                  <p>{room.type.charAt(0).toUpperCase() + room.type.slice(1)}</p>
                </li>
                <li className={styles.tag}>
                  <span>Last changes</span>
                  <p>
                    {new Date(room.timestamp).toLocaleTimeString([], {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    }) +
                      ' ' +
                      'UTC'}
                  </p>
                </li>
              </ul>
            </ul>
          </div>
          {user.id === room.ruler.id && <Button color="bordered">Delete</Button>}
        </div>
        <CloseButton className={styles.close} onClick={onClose} />
      </div>
    </Modal>
  )
}
