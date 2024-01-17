import React from 'react'
import { useRouter } from 'next/router'

import { createRoom } from '@/core/firebase'

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
  const [link, setLink] = React.useState('')
  const [key, setKey] = React.useState('')
  const [error, setError] = React.useState('')
  const [loader, setLoader] = React.useState(false)

  const validate = () => {
    if (topic.trim().length < 4) {
      setError('Topic must be at least 4 characters')
      return false
    } else {
      setError('')
      return true
    }
  }

  const create = async () => {
    if (validate()) {
      setLoader(true)
      const id = String(uuidv4())
      try {
        await createRoom(id, {
          topic,
          type: types[type].destination,
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
        setLoader(false)
      }
    }
  }

  return (
    <div className={cn(styles.modal, { [styles.opened]: isOpened })}>
      <ToastContainer />
      <div className={styles.overlay} onClick={onClose}></div>
      <div className={styles.block}>
        <div className={styles.settings}>
          <div className={styles.general}>
            <span className={styles.option}>Link or ID</span>
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
              <button
                className={cn(styles.card, { [styles.selected]: type === 0 })}
                onClick={() => setType(0)}
              >
                <img className={styles.icon} src="static/public.svg" alt="" />
                <span>
                  {types[0].destination.charAt(0).toUpperCase() + types[0].destination.slice(1)}
                </span>
              </button>
              <button
                className={cn(styles.card, { [styles.selected]: type === 1 })}
                onClick={() => setType(1)}
              >
                <img className={styles.icon} src="static/private.svg" alt="" />
                <span>
                  {types[1].destination.charAt(0).toUpperCase() + types[1].destination.slice(1)}
                </span>
              </button>
              <button
                className={cn(styles.card, { [styles.selected]: type === 2 })}
                onClick={() => setType(2)}
              >
                <img className={styles.icon} src="static/private.svg" alt="" />
                <span>
                  {types[2].destination.charAt(0).toUpperCase() + types[2].destination.slice(1)}
                </span>
              </button>
            </div>
            <p className={styles.description}>{ReactHtmlParser(types[type].description)}</p>
          </div>
          <Button color="green" disabled={loader} onClick={create}>
            Create room
          </Button>
        </div>
        <CloseButton className={styles.close} onClick={onClose} />
      </div>
    </div>
  )
}
