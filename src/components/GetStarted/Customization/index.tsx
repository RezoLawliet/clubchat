import React, { use } from 'react'

import { MdFileUpload } from 'react-icons/md'

import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/Button'
import { AuthCloud } from '@/pages/authentication'

import styles from './style.module.scss'

export const Customization: React.FC = () => {
  const { onNextStep, onPrevStep, user, setUserProps } = React.useContext(AuthCloud)
  const [image, setImage] = React.useState(
    user.imageUrl
      ? typeof user.imageUrl !== 'string'
        ? URL.createObjectURL(user.imageUrl)
        : user.imageUrl
      : ''
  )

  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener('change', customize)
    }
  }, [])

  // const uploadAvatar = async (file: File) => {
  //   const formData = new FormData()
  //   formData.append('photo', file)

  //   const { data } = await axios.post('http://localhost:5000/upload', formData, {
  //     headers: { 'Content-Type': 'multipart/form-data' },
  //   })

  //   return data
  // }

  const customize: any = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setUserProps('imageUrl', file)
      const blob = URL.createObjectURL(file)
      setImage(blob)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.step}>
        <div className={styles.head}>
          <img className={styles.emoji} src="static/surprise.svg" alt="Emoji" />
          <h5 className={styles.title}>{`Hi, ${user.fullname}!`}</h5>
          <p className={styles.description}>There is how other users will see you</p>
        </div>
        <div className={styles.block}>
          <label htmlFor="image">
            <MdFileUpload className={styles.icon} />
            <Avatar className="w-32 h-32" src={image} letters={user.fullname} />
          </label>
          <p className={styles.username}>@{user.username}</p>
          <input id="image" ref={inputRef} type="file" accept=".jpg, .jpeg, .png, .svg" hidden />
          <div className={styles.navbar}>
            <Button color="white" onClick={onPrevStep}>
              Back
            </Button>
            <Button icon="next" onClick={onNextStep}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
