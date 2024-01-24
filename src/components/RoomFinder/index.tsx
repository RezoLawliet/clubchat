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
  isOpened: boolean
  onClose: () => void
}

export const RoomFinder: React.FC<IModal> = ({ isOpened, onClose }) => {
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
          <div className={styles.general}>
            <span className={styles.option}>Find Room</span>
            <input
              className={cn(styles.input, { [styles.error]: error })}
              type="text"
              value={uuid}
              onChange={(event) => setUuid(event.target.value)}
              autoComplete="off"
              placeholder="Enter room's UUID"
            />
            {error && (
              <span className={styles.notification}>
                <MdError className="w-5 h-5" />
                {error}
              </span>
            )}
          </div>
          <Button color="green" disabled={loader} onClick={create}>
            Find room
          </Button>
        </div>
        <CloseButton className={styles.close} onClick={onClose} />
      </div>
    </div>
  )
}
