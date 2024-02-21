import React from 'react'

import cn from 'classnames'
import { v4 as uuidv4 } from 'uuid'
import { MdError } from 'react-icons/md'
import { IoClose } from 'react-icons/io5'
import { MdFileUpload } from 'react-icons/md'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { Modal } from '@/components/Modal'
import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/Button'

import styles from './style.module.scss'

import UserType from '@/core/models/UserModel'

import { createUser } from '@/core/controllers/UserController'

interface IUserEditor {
  user: UserType
  isOpened: boolean
  onClose: () => void
}

export const UserEditor: React.FC<IUserEditor> = ({ user, isOpened, onClose }) => {
  const [error, setError] = React.useState('')
  const [name, setName] = React.useState(user.fullname)
  const [avatar, setAvatar] = React.useState(user.imageUrl)
  const [file, setFile] = React.useState<File | string | null>(user.imageUrl || null)
  const [description, setDescription] = React.useState(user.description)

  const avatarRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (avatarRef.current) {
      avatarRef.current.addEventListener('change', upload)
    }
  }, [])

  const upload: any = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setFile(file)
      const blob = URL.createObjectURL(file)
      setAvatar(blob)
    }
  }

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

  const edit = async () => {
    if (validate()) {
      try {
        const snapshot = {
          fullname: name,
          username: generateUuid(name),
          ...(file !== null && { imageUrl: file }),
          description,
        }
        await createUser(user.id, snapshot)
        toast.success('Preferences changes success', {
          position: 'bottom-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        })
        onClose()
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <Modal isOpened={isOpened} onClose={onClose}>
      <div className={styles.block}>
        <div className={styles.settings}>
          <div className={styles.section}>
            <div className={styles.preview}>
              <label htmlFor="avatar">
                <MdFileUpload className={styles.icon} />
                <Avatar className="w-20 h-20" src={avatar} letters={user.fullname} />
              </label>
              <input
                id="avatar"
                ref={avatarRef}
                type="file"
                accept=".jpg, .jpeg, .png, .svg"
                hidden
              />
              <div className={styles.names}>
                <h2>{name || user.fullname}</h2>
                <span>@{user.username}</span>
              </div>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.option}>Name</span>
            <input
              className={cn(styles.input, { [styles.error]: error })}
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="off"
              placeholder="Enter the new name"
            />
            {error && (
              <span className={styles.notification}>
                <MdError className="w-5 h-5" />
                {error}
              </span>
            )}
          </div>
          <div className={styles.section}>
            <span className={styles.option}>Description</span>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              autoComplete="off"
              placeholder="Add some description about yourself"
            />
          </div>
          <Button onClick={edit}>Edit</Button>
        </div>
        <IoClose className={styles.close} onClick={onClose} />
      </div>
    </Modal>
  )
}
