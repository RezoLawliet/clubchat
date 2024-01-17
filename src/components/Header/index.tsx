import React from 'react'
import Link from 'next/link'

import { Avatar } from '@/components/Avatar'

import styles from './style.module.scss'

interface IHeader {
  fullname: string
  username: string
  imageUrl?: string
}

export const Header: React.FC<IHeader> = ({ fullname, username, imageUrl }) => {
  return (
    <header className={styles.header}>
      <Link className={styles.logotype} href="/rooms">
        <img src="/static/wave-hand.svg" alt="" />
        <h3>ClubChat</h3>
      </Link>
      <Link className={styles.user} href={`/user/${username}`}>
        <Avatar className="w-12 h-12" src={imageUrl} letters={fullname} />
        <span>@{username}</span>
      </Link>
    </header>
  )
}
