import * as firebase from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  getDatabase,
  ref as databaseRef,
  set,
  get,
  query,
  orderByKey,
  remove,
} from 'firebase/database'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

import { v4 as uuidv4 } from 'uuid'

export const app = firebase.initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FB_DATABASE_URL,
})

export const auth = getAuth(app)
export const database = getDatabase(app)
export const storage = getStorage(app)

export const setImageFile = async (path, file) => {
  try {
    const id = String(uuidv4())
    const imageRef = storageRef(storage, `images/rooms/${path}/${id}`)
    await uploadBytes(imageRef, file)
    const url = await getDownloadURL(imageRef)
    return url
  } catch (error) {
    console.error(error)
    return null
  }
}

export const sendChatMessage = async (room, owner, message, type = null) => {
  try {
    const timestamp = Date.now()
    const record = {
      owner,
      message,
      ...(type !== null && { type }),
      timestamp: timestamp,
    }
    const messageRef = databaseRef(database, `rooms/${room}/messages/${timestamp}`)
    await set(messageRef, record)
  } catch (error) {
    console.error(error)
  }
}

export const getUserById = async (id) => {
  const userRef = databaseRef(database, `users/${id}`)
  try {
    const snapshot = await get(userRef)
    if (snapshot.exists()) {
      return { id: snapshot.key, ...snapshot.val() }
    } else return null
  } catch (error) {
    console.error(error)
  }
}

export const getUserByProps = async (props) => {
  const userRef = databaseRef(database, 'users')
  try {
    const snapshot = await get(userRef)
    if (snapshot.exists()) {
      const users = snapshot.val()
      const user = Object.values(users).find((user) => user.props === props)
      return user
    } else return null
  } catch (error) {
    console.error(error)
  }
}

// export const getAuthUser = async () => {
//   return new Promise((resolve, reject) => {
//     const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
//       console.log(auth)
//       if (authUser) {
//         const userRef = databaseRef(database, `users/${authUser.uid}`)
//         try {
//           const snapshot = await get(userRef)
//           if (snapshot.exists()) {
//             const data = snapshot.val()
//             resolve(data)
//           }
//         } catch (error) {
//           console.error(error)
//           reject(error)
//         } finally {
//           unsubscribe()
//         }
//       } else {
//         resolve(null)
//         unsubscribe()
//       }
//     })
//   })
// }

export const createUser = async (id, data) => {
  const userRef = databaseRef(database, `users/${id}`)
  const imageRef = storageRef(storage, `images/users/${id}`)

  try {
    const imageUrl = data.imageUrl
    if (imageUrl) {
      await uploadBytes(imageRef, imageUrl)
      const url = await getDownloadURL(imageRef)
      data.imageUrl = url
    }
    set(userRef, data)
  } catch (error) {
    console.error(error)
  }
}

export const getAllRooms = async () => {
  const roomsRef = databaseRef(database, 'rooms')
  const roomsQuery = query(roomsRef, orderByKey())

  try {
    const snapshot = await get(roomsQuery)
    if (snapshot.exists()) {
      const rooms = snapshot.val()
      const collection = await Promise.all(
        Object.keys(rooms).map(async (item) => {
          const room = rooms[item]
          const members = room.members
            ? await Promise.all(room.members.map((member) => getUserById(member)))
            : []
          const membersWithData = members.filter(Boolean)
          return {
            id: item,
            ...room,
            members: membersWithData,
          }
        })
      )
      const roomsWithMembers = await Promise.all(collection)
      return roomsWithMembers
    } else return null
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getRoomById = async (id) => {
  const roomRef = databaseRef(database, `rooms/${id}`)

  try {
    const snapshot = await get(roomRef)
    if (snapshot.exists()) {
      const room = snapshot.val()
      const members = room.members
        ? await Promise.all(room.members.map((member) => getUserById(member)))
        : []
      const membersWithData = members.filter(Boolean)
      const messages = room.messages ? Object.values(room.messages) : []
      const senders = Array.from(new Set(messages.map((message) => message.owner)))
      const sendersWithData = await Promise.all(senders.map((sender) => getUserById(sender)))
      const messagesWithData = messages.map((message) => {
        const messageWithSenders = sendersWithData.find((user) => user.id === message.owner)
        const { owner, ...rest } = message
        return { owner: messageWithSenders, ...rest }
      })
      return {
        id,
        ...room,
        members: membersWithData,
        messages: messagesWithData,
      }
    } else return null
  } catch (error) {
    console.error(error)
  }
}

export const createRoom = async (id, data) => {
  const roomRef = databaseRef(database, `rooms/${id}`)
  try {
    set(roomRef, data)
  } catch (error) {
    console.error(error)
  }
}

export const joinRoom = async (roomId, userId) => {
  const roomRef = databaseRef(database, `rooms/${roomId}`)
  try {
    const snapshot = await get(roomRef)
    const members = snapshot.val().members || []
    if (!members.includes(userId)) {
      const membersWithUser = [...members, userId]
      await set(roomRef, { ...snapshot.val(), members: membersWithUser })
      const user = await getUserById(userId)
      await sendChatMessage(
        roomId,
        userId,
        `${user.fullname} just joined the channel`,
        'notification'
      )
    }
  } catch (error) {
    console.error(error)
  }
}

export const leaveRoom = async (roomId, userId) => {
  const roomRef = databaseRef(database, `rooms/${roomId}`)
  try {
    const snapshot = await get(roomRef)
    if (snapshot.exists()) {
      const room = snapshot.val()
      const members = room.members || []
      if (members.length <= 1 && members.includes(userId)) {
        await remove(roomRef)
      } else if (members.includes(userId)) {
        const membersWithoutUser = members.filter((memberId) => memberId !== userId)
        await set(roomRef, { ...room, members: membersWithoutUser })
        const user = await getUserById(userId)
        await sendChatMessage(
          roomId,
          userId,
          `${user.fullname} just left the channel`,
          'notification'
        )
      }
    }
  } catch (error) {
    console.error(error)
  }
}

export const getMessagesByRoom = async (room) => {
  try {
    const snapshot = await getRoomById(room)
    if (snapshot) {
      const messages = Object.values(snapshot.messages)
      const senders = Array.from(new Set(messages.map((message) => message.owner)))
      const sendersWithData = await Promise.all(senders.map((sender) => getUserById(sender)))
      return messages.map((message) => {
        const messageWithSenders = sendersWithData.find((user) => user.id === message.owner)
        const { owner, ...rest } = message
        return { owner: messageWithSenders, ...rest }
      })
    } else return null
  } catch (error) {
    console.error(error)
  }
}
