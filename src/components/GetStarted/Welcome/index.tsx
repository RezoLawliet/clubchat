import React from 'react'
import { useRouter } from 'next/router'

import { Button } from '@/components/Button'

import styles from './style.module.scss'

export const Welcome: React.FC = () => {
  const router = useRouter()

  return (
    <div className={styles.container}>
      <ul className={styles.particles}>
        <li className={styles.particle}></li>
        <li className={styles.particle}></li>
        <li className={styles.particle}></li>
        <li className={styles.particle}></li>
        <li className={styles.particle}></li>
        <li className={styles.particle}></li>
        <li className={styles.particle}></li>
        <li className={styles.particle}></li>
        <li className={styles.particle}></li>
        <li className={styles.particle}></li>
      </ul>
      <div className={styles.step}>
        <div className={styles.head}>
          <img className={styles.emoji} src="static/wave-hand.svg" alt="Emoji" />
          <h5 className={styles.title}>Welcome to the club, buddy!</h5>
        </div>
        <p className={styles.slogan}>Friends over followers</p>
        <Button onClick={() => router.push('/authentication')}>Get Started</Button>
      </div>
    </div>
  )
}
