import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { IoChevronBack } from 'react-icons/io5'

import { Avatar } from '@/components/Avatar'
import { UserEditor } from '@/components/UserEditor'

import { ref, onValue } from 'firebase/database'
import { database, getUserById, onSubscribe, onUnsubscribe } from '@/core/firebase'

import styles from './style.module.scss'

type UserType = {
  id: string
  fullname: string
  username: string
  imageUrl?: string
  description?: string
  subscribers?: string[]
  subscribings?: string[]
}

interface IUser {
  authUser: UserType
  contentUser: UserType
}

export const User: React.FC<IUser> = ({ authUser, contentUser }) => {
  const router = useRouter()
  const [user, setUser] = React.useState(contentUser)
  const [isEditor, setIsEditor] = React.useState(false)

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
    <>
      <Head>
        <title>@{user.username}</title>
      </Head>
      <main className="main">
        {isEditor && (
          <UserEditor isOpened={isEditor} onClose={() => setIsEditor(false)} user={user} />
        )}
        <button className={styles.link} onClick={() => router.back()}>
          <IoChevronBack />
          Back
        </button>
        <div className={styles.user}>
          <div className={styles.head}>
            <div className={styles.hero}>
              <Avatar className="w-20 h-20" src={user.imageUrl} letters={user.fullname} />
              <div className={styles.username}>
                <h2>{user.fullname}</h2>
                <span>@{user.username}</span>
              </div>
              <div className={styles.controls}>
                {authUser.id === user.id ? (
                  <button className={styles.subscribe} onClick={() => setIsEditor(true)}>
                    Preferences
                  </button>
                ) : !user.subscribers?.includes(authUser.id) ? (
                  <button className={styles.subscribe} onClick={() => onSubscribe(authUser, user)}>
                    Subscribe
                  </button>
                ) : (
                  <button
                    className={styles.unsubscribe}
                    onClick={() => onUnsubscribe(authUser, user)}
                  >
                    Unsubscribe
                  </button>
                )}
              </div>
            </div>
            <div className={styles.statistic}>
              <div className={styles.counter}>
                <h2>{user.subscribers?.length || 0}</h2>
                <span>subscribers</span>
              </div>
              <div className={styles.counter}>
                <h2>{user.subscribings?.length || 0}</h2>
                <span>subscribings</span>
              </div>
            </div>
          </div>
          <div className={styles.about}>
            <p>{user.description ? user.description : 'There is no user information available'}</p>
          </div>
        </div>
      </main>
    </>
  )
}
