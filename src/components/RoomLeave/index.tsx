import React from 'react'
import { useRouter } from 'next/router'

import { createRoom, leaveRoom } from '@/core/firebase'

import cn from 'classnames'
import { v4 as uuidv4 } from 'uuid'
import ReactHtmlParser from 'react-html-parser'

import { IoClose as CloseButton } from 'react-icons/io5'
import { Button } from '@/components/Button'

import styles from './style.module.scss'
import { Loader } from '../Loader'

const types = [
  {
    destination: 'public',
    description: `A <b>public</b> destination will makes your room becomes accessible to join
  <b>everyone</b>`,
  },
  {
    destination: 'limited',
    description: `A <b>limited</b> destination will makes your room becomes accessible to join
  <b>limited</b> and <b>trusted persons</b>`,
  },
  {
    destination: 'private',
    description: `A <b>private</b> destination will makes your room becomes accessible to join by persons with a
  <b>key</b>`,
  },
]

interface IModal {
  isOpened: boolean
  onClose: () => void
  onLeave: () => void
}

export const RoomLeave: React.FC<IModal> = ({ isOpened, onClose, onLeave }) => {
  const router = useRouter()
  const [topic, setTopic] = React.useState('')
  const [type, setType] = React.useState(0)
  const [loader, setLoader] = React.useState(false)

  return (
    <div className={cn(styles.modal, { [styles.opened]: isOpened })}>
      <div className={styles.overlay} onClick={onClose}></div>
      <div className={styles.block}>
        <p className={styles.head}>Are you sure</p>
        <span>Do you really wanna leave?</span>
        <div className={styles.controls}>
          <Button color="transparent" onClick={onClose}>
            Cancel
          </Button>
          <Button color="bordered" onClick={onLeave}>
            Leave chat
          </Button>
        </div>
      </div>
    </div>
  )
}
