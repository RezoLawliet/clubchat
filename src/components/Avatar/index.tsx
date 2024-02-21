import React from 'react'

import cn from 'classnames'

import styles from './style.module.scss'

interface IAvatar {
  src?: string
  className?: string
  letters: string
}

export const Avatar: React.FC<IAvatar> = ({ src, className, letters }) => {
  letters = letters
    ?.split(' ')
    .slice(0, 2)
    .map((letter: string) => letter[0])
    .join('')
    .toUpperCase()
  return (
    <div
      className={cn(className, styles.avatar, { [styles.generated]: !src })}
      style={{ backgroundImage: src && `url(${src})` }}
    >
      {!src && letters}
    </div>
  )
}
