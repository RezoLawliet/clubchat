import React from 'react'
import { useRouter } from 'next/router'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { PatternFormat } from 'react-number-format'
import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
} from 'firebase/auth'

import { auth, createUser, getUserById } from '@/core/firebase'

import { Button } from '@/components/Button'
import { Loader } from '@/components/Loader'
import { AuthCloud } from '@/pages/authentication'

import styles from './style.module.scss'

export const Verification: React.FC = () => {
  const router = useRouter()
  const { onPrevStep, user, setUserProps } = React.useContext(AuthCloud)

  const [phone, setPhone] = React.useState(user.phone)
  const [code, setCode] = React.useState('')
  const [verifier, setVerifier] = React.useState('')
  const [confirmation, setConfirmation] = React.useState(false)
  const [loader, setLoader] = React.useState(false)

  const verificate = async () => {
    setLoader(true)
    try {
      setUserProps('phone', phone.replaceAll(' ', ''))
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('Капча пройдена!')
        },
        'expired-callback': () => {
          console.log('Капча не пройдена!')
        },
        'error-callback': () => {
          console.log('Капча не пройдена!')
        },
      })
      await recaptchaVerifier.verify()
      const confirmation = await signInWithPhoneNumber(auth, phone, recaptchaVerifier)
      setVerifier(confirmation.verificationId)
      setConfirmation(true)
    } catch (error) {
      console.error(error)
      toast.error('Error until the sending SMS-code', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      })
    }
    setLoader(false)
  }

  const authenticate = async () => {
    setLoader(true)
    try {
      const credential = PhoneAuthProvider.credential(verifier, code)
      const data = await signInWithCredential(auth, credential)
      await createUser(data.user.uid, user)
      const authUser = await getUserById(data.user.uid)
      if (authUser) {
        toast.success('Successfull authentication', {
          position: 'bottom-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        })
        router.push('/rooms')
      } else {
        toast.error('Error until the creation on server', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        })
        setLoader(false)
      }
    } catch (error) {
      console.error(error)
      toast.error('Entered invalid SMS-code', {
        position: 'top-center',
        autoClose: 4000,
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
          <img className={styles.emoji} src="static/phone.svg" alt="Emoji" />
          <h5 className={styles.title}>Enter phone number</h5>
          <p className={styles.description}>We will send you a confirmation code</p>
        </div>
        <div className={styles.block}>
          {!confirmation ? (
            <PatternFormat
              className={styles.input}
              format="+# ### ### ## ##"
              allowEmptyFormatting
              mask="#"
              placeholder="+1 450 050 55 00"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          ) : (
            <input
              className={styles.input}
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Enter your code..."
            />
          )}
          <div id="recaptcha-container" />
          {!loader ? (
            <div className={styles.navbar}>
              <Button color="white" onClick={onPrevStep}>
                Back
              </Button>
              <Button
                icon="next"
                onClick={!confirmation ? verificate : authenticate}
                disabled={!phone || phone.includes('#') || (confirmation && code.length < 6)}
              >
                Verify
              </Button>
            </div>
          ) : (
            <Loader />
          )}
          <p className={styles.terms}>
            By entering your phone number, you're agreeing to our
            <br />
            Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
