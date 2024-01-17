import React from 'react'
import { useRouter } from 'next/router'

import cn from 'classnames'
import { v4 as uuidv4 } from 'uuid'

import { MdError } from 'react-icons/md'

import { Button } from '@/components/Button'
import { AuthCloud } from '@/pages/authentication'

import styles from './style.module.scss'

type StepsType = {
  onNextStep: () => void
  onPrevStep: () => void
}

export const Identification: React.FC<StepsType> = () => {
  const router = useRouter()
  const { onNextStep, user, setUserProps } = React.useContext(AuthCloud)
  const [name, setName] = React.useState(user.fullname)
  const [error, setError] = React.useState('')

  const generateUuid = (name: string) => {
    const username = String(name + '#' + uuidv4().substring(0, 6))
      .replaceAll(' ', '')
      .toLowerCase()
    return username
  }

  const validate = () => {
    if (name.trim().length < 4) {
      setError('Name must be at least 4 characters')
      return false
    } else {
      setError('')
      return true
    }
  }

  const identificate = () => {
    if (validate()) {
      setUserProps('fullname', name)
      setUserProps('username', generateUuid(name))
      onNextStep()
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.step}>
        <div className={styles.head}>
          <img className={styles.emoji} src="static/person.svg" alt="Emoji" />
          <h5 className={styles.title}>Who are you?</h5>
          <p className={styles.description}>Please, tell me your real or user name</p>
        </div>
        <div className={styles.block}>
          <input
            className={cn(styles.input, { [styles.error]: error })}
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="John Doe"
            autoComplete="off"
            spellCheck="false"
          />
          {error && (
            <span className={styles.notification}>
              <MdError className="w-5 h-5" />
              {error}
            </span>
          )}
          <div className={styles.navbar}>
            <Button color="white" onClick={() => router.push('/')}>
              Back
            </Button>
            <Button icon="next" onClick={identificate} disabled={!name}>
              Go Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
