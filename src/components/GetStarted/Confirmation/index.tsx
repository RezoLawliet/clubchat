import React from 'react'
import { useRouter } from 'next/router'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { auth, createUser } from '@/core/firebase'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'

import { Button } from '@/components/Button'
import { Loader } from '@/components/Loader'
import { AuthCloud } from '@/pages/authentication'

import styles from './style.module.scss'

export const Confirmation: React.FC = () => {
  const router = useRouter()
  const { onPrevStep, verifierKey, user } = React.useContext(AuthCloud)
  const [code, setCode] = React.useState(['', '', '', '', '', ''])
  const [loader, setLoader] = React.useState(false)

  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  React.useEffect(() => {
    if (code.join('').length === 6) {
      confirmate()
    }
  }, [code])

  const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const index = Number(event.target.getAttribute('id'))
    const value = event.target.value
    setCode((prev) => {
      const kit = [...prev]
      kit[index] = value
      return kit
    })
    if (value !== '' && event.target.nextSibling) {
      ;(event.target.nextSibling as HTMLInputElement).focus()
    } else if (value === '' && event.target.previousSibling) {
      ;(event.target.previousSibling as HTMLInputElement).focus()
    }
  }

  const confirmate = async () => {
    setLoader(true)
    try {
      const data = await verifierKey.confirm(code.join(''))
      await createUser(data.user.uid, user)
      router.push('/rooms')
    } catch (error) {
      console.error(error)
      toast.warning('Entered invalid SMS-code', {
        position: 'top-center',
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      })
      setLoader(false)
    }
  }

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.step}>
        <div className={styles.head}>
          <img className={styles.emoji} src="static/shield.svg" alt="Emoji" />
          <h5 className={styles.title}>Enter activation code</h5>
        </div>
        <div className={styles.block}>
          <div className={styles.inputs}>
            {code.map((input, index) => (
              <input
                key={index}
                className={styles.input}
                id={String(index)}
                ref={index === 0 ? inputRef : null}
                type="tel"
                maxLength={1}
                placeholder="_"
                autoComplete="off"
                value={input}
                onChange={inputChange}
              />
            ))}
          </div>
          {!loader ? (
            <div className={styles.navbar}>
              <Button onClick={onPrevStep} color="white">
                Back
              </Button>
            </div>
          ) : (
            <Loader />
          )}
          <p className={styles.terms}>
            By entering your number, you're agreeing to our
            <br />
            Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
