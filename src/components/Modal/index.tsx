import React from 'react'

import cn from 'classnames'

import { IoClose } from 'react-icons/io5'

import styles from './style.module.scss'

interface IModal {
  children: any
  isOpened: boolean
  onClose: () => void
}

export const Modal: React.FC<IModal> = ({ children, isOpened, onClose }) => {
  return (
    <div className={cn(styles.modal, { [styles.opened]: isOpened })}>
      <div className={styles.overlay} onClick={onClose}></div>
      {children}
    </div>
  )
}
