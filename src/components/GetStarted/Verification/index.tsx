import React from 'react'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { PatternFormat } from 'react-number-format'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'

import { auth, getUserByProps } from '@/core/firebase'

import { Button } from '@/components/Button'
import { Loader } from '@/components/Loader'
import { AuthCloud } from '@/pages/authentication'

import styles from './style.module.scss'

export const Verification: React.FC = () => {
  const { onNextStep, onPrevStep, user, setUserProps, setVerifierKey } = React.useContext(AuthCloud)
  const [phone, setPhone] = React.useState(user.phone)
  const [loader, setLoader] = React.useState(false)

  const verification = async () => {
    setLoader(true)
    try {
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          onNextStep()
          setUserProps('phone', phone.replaceAll(' ', ''))
        },
      })
      await verifier.verify()
      const confirmation = await signInWithPhoneNumber(auth, phone, verifier)
      setVerifierKey(confirmation)
    } catch (error) {
      console.error(error)
      toast.error('Error until the sending SMS-code', {
        position: 'top-center',
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      })
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
          <PatternFormat
            className={styles.input}
            format="+# ### ### ## ##"
            allowEmptyFormatting
            mask="#"
            placeholder="+1 450 050 55 00"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          {!loader ? (
            <div className={styles.navbar}>
              <Button color="white" onClick={onPrevStep}>
                Back
              </Button>
              <Button icon="next" onClick={verification} disabled={!phone || phone.includes('#')}>
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
