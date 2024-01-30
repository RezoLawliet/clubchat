import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import cn from 'classnames'
import { IoMdMore } from 'react-icons/io'

import { Avatar } from '@/components/Avatar'

import styles from './style.module.scss'

import { ref, onValue } from 'firebase/database'
import { database, getUserById } from '@/core/firebase'

interface IHeader {
  authUser: {
    id: string
    fullname: string
    username: string
    imageUrl?: string
  }
}

export const Header: React.FC<IHeader> = ({ authUser }) => {
  const router = useRouter()
  const [user, setUser] = React.useState(authUser)
  const [isPopup, setIsPopup] = React.useState(false)

  React.useEffect(() => {
    const userRef = ref(database, `users/${user.id}`)

    const subscribe = onValue(userRef, async () => {
      const response = await getUserById(user.id)
      setUser(response)
    })

    return () => {
      subscribe()
    }
  }, [])

  return (
    <header className={styles.header}>
      <Link className={styles.logotype} href="/rooms">
        <img src="/static/wave-hand.svg" alt="" />
        <h3>ClubChat</h3>
      </Link>
      <div className={styles.user}>
        <Link className={styles.link} href={`/user/${user.id}`}>
          <Avatar className="w-12 h-12" src={user.imageUrl} letters={user.fullname} />
          <span>@{user.username}</span>
        </Link>
        <button
          className={cn(styles.settings, { [styles.opened]: isPopup })}
          onClick={() => setIsPopup(!isPopup)}
        >
          <IoMdMore className={styles.settingsIcon} />
          <ul className={cn(styles.popup, { [styles.opened]: isPopup })}>
            <li className={styles.option} onClick={() => router.push(`/user/${user.id}`)}>
              Preferences
            </li>
            <li className={cn(styles.option, 'text-red-500')}>Logout</li>
          </ul>
        </button>
      </div>
    </header>
  )
}
