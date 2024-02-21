import UserType from '../models/UserModel'

import { ref as databaseRef, get, orderByKey, query, remove, set, update } from 'firebase/database'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

import { database, storage } from '@/core/firebase'

export const createUser = async (userId: string, content: any) => {
  const userRef = databaseRef(database, `users/${userId}`)
  const imageRef = storageRef(storage, `images/users/${userId}`)
  try {
    const imageUrl = content.imageUrl
    if (imageUrl && typeof imageUrl !== 'string') {
      await uploadBytes(imageRef, imageUrl)
      const url = await getDownloadURL(imageRef)
      content.imageUrl = url
    }
    const snapshot = await get(userRef)
    if (snapshot.exists()) {
      update(userRef, content)
    } else {
      set(userRef, content)
    }
  } catch (error) {
    console.error(error)
  }
}

export const getUserById = async (userId: string) => {
  const userRef = databaseRef(database, `users/${userId}`)
  try {
    const snapshot = await get(userRef)
    if (snapshot.exists()) {
      return { id: snapshot.key, ...snapshot.val() }
    } else return null
  } catch (error) {
    console.error(error)
  }
}

export const getUserByProps = async (props: any) => {
  const userRef = databaseRef(database, 'users')
  try {
    const snapshot = await get(userRef)
    if (snapshot.exists()) {
      const users = snapshot.val()
      const user = Object.values(users).find((user: any) => user.props === props)
      return user
    } else return null
  } catch (error) {
    console.error(error)
  }
}
