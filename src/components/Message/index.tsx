import React from 'react'
import Link from 'next/link'

import cn from 'classnames'
import Linkify from 'react-linkify'

import { Avatar } from '@/components/Avatar'

import styles from './style.module.scss'

interface IUser {
  id: string
  fullname: string
  username: string
  imageUrl?: string
}

interface IMessage {
  user: IUser
  owner: IUser
  message: string
  type?: string
  timestamp: number
}

export const Message: React.FC<IMessage> = ({ user, owner, message, type, timestamp }) => {
  return (
    <>
      {type === 'notification' ? (
        <p className={styles.notification}>{message}</p>
      ) : (
        <div
          className={cn(styles.message, {
            [styles.sended]: owner.id === user.id,
            [styles.received]: owner.id !== user.id,
          })}
        >
          {owner.id !== user.id && (
            <Link className="m-1 self-end" href={`/user/${owner.id}`}>
              <Avatar className="w-12 h-12" src={owner.imageUrl} letters={owner.fullname} />
            </Link>
          )}
          <div className={styles.block}>
            {owner.id !== user.id && (
              <Link href={`/user/${owner.id}`}>
                <span className={styles.owner}>{owner.fullname}</span>
              </Link>
            )}
            {type === 'imageUrl' ? (
              <img className={styles.image} src={message} alt="image" />
            ) : (
              <div className={styles.container}>
                {type !== 'imageUrl' && (
                  <p>
                    <Linkify
                      componentDecorator={(href, text, key) => (
                        <Link href={href} key={key} className="text-blue-500">
                          {text}
                        </Link>
                      )}
                    >
                      {message}
                    </Linkify>
                  </p>
                )}
                <div className={styles.details}>
                  <span className={styles.timestamp}>
                    {new Date(timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
