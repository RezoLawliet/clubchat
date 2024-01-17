import React from 'react'
import Head from 'next/head'

import { Avatar } from '@/components/Avatar'
import { Breadcrumbs } from '@/components/Breadcrumbs'

import styles from './style.module.scss'
import Link from 'next/link'
import { IoChevronBack } from 'react-icons/io5'
import { useRouter } from 'next/router'

interface IUser {
  fullname: string
  username: string
  imageUrl?: string
}

export const User: React.FC<IUser> = ({ fullname, username, imageUrl }) => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>@{username}</title>
      </Head>
      <main className="main">
        <button className={styles.link} onClick={() => router.back()}>
          <IoChevronBack />
          Back
        </button>
        <div className={styles.user}>
          <div className={styles.head}>
            <div className={styles.hero}>
              <Avatar className="w-20 h-20" src={imageUrl} letters={fullname} />
              <div className={styles.username}>
                <h2>{fullname}</h2>
                <span>@{username}</span>
              </div>
              <div className={styles.control}>
                <button className={styles.subscribe}>Follow</button>
                <button>
                  <img width="20px" height="20px" src="/static/more.svg" alt="" />
                </button>
              </div>
            </div>
            <div className={styles.statistic}>
              <div className={styles.counter}>
                <h2>2</h2>
                <span>followers</span>
              </div>
              <div className={styles.counter}>
                <h2>0</h2>
                <span>following</span>
              </div>
            </div>
          </div>
          <div className={styles.description}>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus rerum, mollitia, omnis
              dolor quidem recusandae architecto voluptatibus quaerat molestiae porro repudiandae
              incidunt quis labore consequuntur est accusantium quia culpa facilis rem reiciendis!
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
