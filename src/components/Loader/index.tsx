import React from 'react'

import { AiOutlineLoading } from 'react-icons/ai'

import styles from './style.module.scss'

export const Loader: React.FC = () => {
  return (
    <div className={styles.loader}>
      <AiOutlineLoading className={styles.progress} />
    </div>
  )
}
