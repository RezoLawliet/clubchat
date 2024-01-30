import React from 'react'

import cn from 'classnames'

import styles from './style.module.scss'

interface IEmpty {
  className?: string
  emoji: any
  title: string
  description: string
}

export const Empty: React.FC<IEmpty> = ({ className, emoji, title, description }) => {
  return (
    <div className={cn(className, styles.block)}>
      <div className={styles.head}>{emoji}</div>
      <div className={styles.container}>
        <h5 className={styles.title}>{title}</h5>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  )
}
