import React from 'react'
import { useRouter } from 'next/router'

import { getRoomById } from '@/core/firebase'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { IoClose as CloseButton } from 'react-icons/io5'

import { Modal } from '@/components/Modal'
import { Button } from '@/components/Button'

import styles from './style.module.scss'

import UserType from '@/core/models/UserModel'
import RoomType from '@/core/models/RoomModel'
import { removeRoom } from '@/core/controllers/RoomController'
import { AreYouSure } from '../AreYouSure'

interface IRoomInfo {
  user: UserType
  room: RoomType
  isOpened: boolean
  onClose: () => void
}

export const RoomInfo: React.FC<IRoomInfo> = ({ user, room, isOpened, onClose }) => {
  const [isDelete, setIsDelete] = React.useState(false)

  return (
    <>
      {isDelete ? (
        <AreYouSure
          topic="Do you really wanna delete this room?"
          action="Delete"
          isOpened={isDelete}
          onClose={() => setIsDelete(false)}
          onSubmit={() => removeRoom(room.id)}
        />
      ) : (
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
              {user.id === room.ruler.id && (
                <Button color="bordered" onClick={() => setIsDelete(true)}>
                  Delete
                </Button>
              )}
            </div>
            <CloseButton className={styles.close} onClick={onClose} />
          </div>
        </Modal>
      )}
    </>
  )
}
