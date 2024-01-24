import React from 'react'
import { useRouter } from 'next/router'

import { createRoom, getRoomById } from '@/core/firebase'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import cn from 'classnames'
import { v4 as uuidv4 } from 'uuid'
import ReactHtmlParser from 'react-html-parser'

import { MdError } from 'react-icons/md'

import { IoClose as CloseButton } from 'react-icons/io5'
import { Button } from '@/components/Button'

import styles from './style.module.scss'

interface IModal {
  room: object
  isOpened: boolean
  onClose: () => void
}

export const RoomInfo: React.FC<IModal> = ({ room, isOpened, onClose }) => {
  const router = useRouter()
  const [uuid, setUuid] = React.useState('')
  const [error, setError] = React.useState('')
  const [loader, setLoader] = React.useState(false)

  const create = async () => {
    setLoader(true)
    try {
      const room = await getRoomById(uuid)
      if (room) {
        router.push(`/rooms/${uuid}`)
      } else {
        setError('Error input')
        toast.error('Error until the find room', {
          position: 'top-center',
          autoClose: 7000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        })
        setLoader(false)
      }
    } catch (error) {
      console.error(error)
      toast.error('Error until the find room', {
        position: 'top-center',
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      })
      setLoader(false)
    }
  }

  return (
    <div className={cn(styles.modal, { [styles.opened]: isOpened })}>
      <ToastContainer />
      <div className={styles.overlay} onClick={onClose}></div>
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
                <span>Key</span>
                <p>{room.key}</p>
              </li>
            </ul>
          </div>
          <div className={styles.definition}>
            <span className={styles.option}>Additional</span>
            <ul className={styles.info}>
              <ul className="grid grid-cols-2">
                <li className={styles.tag}>
                  <span>Destination</span>
                  <p>{room.type}</p>
                </li>
                <li className={styles.tag}>
                  <span>Created at</span>
                  <p>{room.timestamp}</p>
                </li>
              </ul>
              <li className={styles.tag}>
                <span>Ruler</span>
                <p>{room.ruler}</p>
              </li>
            </ul>
          </div>
          <Button color="bordered">Delete</Button>
        </div>
        <CloseButton className={styles.close} onClick={onClose} />
      </div>
    </div>
  )
}
