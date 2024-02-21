import React from 'react'

import cn from 'classnames'

import { Button } from '@/components/Button'

import styles from './style.module.scss'

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
  topic: string
  action: string
  isOpened: boolean
  onClose: () => void
  onSubmit: () => void
}

export const AreYouSure: React.FC<IModal> = ({ topic, action, isOpened, onClose, onSubmit }) => {
  return (
    <div className={cn(styles.modal, { [styles.opened]: isOpened })}>
      <div className={styles.overlay} onClick={onClose}></div>
      <div className={styles.block}>
        <p className={styles.head}>Are you sure</p>
        <span>{topic}</span>
        <div className={styles.controls}>
          <Button color="transparent" onClick={onClose}>
            Cancel
          </Button>
          <Button color="bordered" onClick={onSubmit}>
            {action}
          </Button>
        </div>
      </div>
    </div>
  )
}
