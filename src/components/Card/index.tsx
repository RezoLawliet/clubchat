import React from 'react'
import Link from 'next/link'

import { FaUserFriends } from 'react-icons/fa'

import { Avatar } from '@/components/Avatar'

import styles from './style.module.scss'

import UserType from '@/core/models/UserModel'

interface ICard {
  path: string
  topic: string
  type: string
  members: UserType[]
}

export const Card: React.FC<ICard> = ({ path, topic, type, members = [] }) => {
  return (
    <Link className={styles.card} href={path}>
      <h3 className={styles.head}>{topic}</h3>
      <div className={styles.container}>
        <div className={styles.avatars}>
          {members
            .map((member) => (
              <Avatar
                key={member.username}
                className="w-full h-full"
                src={member.imageUrl}
                letters={member.fullname}
              />
            ))
            .slice(0, 4)}
        </div>
        <div className={styles.details}>
          <ul className={styles.members}>
            {members.map((member) => <li key={member.username}>@{member.username}</li>).slice(0, 4)}
          </ul>
          <div className={styles.footer}>
            <div className={styles.quantity}>
              <span>{members.length}</span>
              <FaUserFriends className="w-5 h-5 text-zinc-700" />
            </div>
            <span className={styles.type}>{type}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
