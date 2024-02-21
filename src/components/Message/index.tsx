import React from 'react'
import Link from 'next/link'

import cn from 'classnames'
import Linkify from 'react-linkify'

import { Avatar } from '@/components/Avatar'

import styles from './style.module.scss'

import UserType from '@/core/models/UserModel'
import MessageType from '@/core/models/MessageModel'

interface IMessage {
  user: UserType
  message: MessageType
}

export const Message: React.FC<IMessage> = ({ user, message }) => {
  return (
    <>
      {message.type === 'notification' ? (
        <p className={styles.notification}>{message.message}</p>
      ) : (
        <div
          className={cn(styles.message, {
            [styles.sended]: message.owner.id === user.id,
            [styles.received]: message.owner.id !== user.id,
          })}
        >
          {message.owner.id !== user.id && (
            <Link className="m-1 self-end" href={`/user/${message.owner.id}`}>
              <Avatar
                className="w-12 h-12"
                src={message.owner.imageUrl}
                letters={message.owner.fullname}
              />
            </Link>
          )}
          <div className={styles.block}>
            {message.owner.id !== user.id && (
              <Link href={`/user/${message.owner.id}`}>
                <span className={styles.owner}>{message.owner.fullname}</span>
              </Link>
            )}
            {message.type === 'imageUrl' ? (
              <img className={styles.image} src={message.message} alt="image" />
            ) : (
              <div className={styles.container}>
                {message.type !== 'imageUrl' && (
                  <p>
                    <Linkify
                      componentDecorator={(href, text, key) => (
                        <Link href={href} key={key} className="text-blue-500">
                          {text}
                        </Link>
                      )}
                    >
                      {message.message}
                    </Linkify>
                  </p>
                )}
                <div className={styles.details}>
                  <span className={styles.timestamp}>
                    {new Date(message.timestamp).toLocaleTimeString([], {
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
