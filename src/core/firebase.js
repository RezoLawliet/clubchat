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
  update,
} from 'firebase/database'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

import { v4 as uuidv4 } from 'uuid'

export const app = firebase.initializeApp({
  apiKey: 'AIzaSyDtUdidae9oAVZUFL81a9ZA5PeF5Y_yUTw',
  authDomain: 'clubhouse-c128a.firebaseapp.com',
  projectId: 'clubhouse-c128a',
  storageBucket: 'clubhouse-c128a.appspot.com',
  messagingSenderId: '349378794758',
  appId: '1:349378794758:web:d5877998f14da849ee3a87',
  databaseURL: 'https://clubhouse-c128a-default-rtdb.europe-west1.firebasedatabase.app',
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
    if (imageUrl && typeof imageUrl !== 'string') {
      await uploadBytes(imageRef, imageUrl)
      const url = await getDownloadURL(imageRef)
      data.imageUrl = url
    }
    const snapshot = await get(userRef)
    if (snapshot.exists()) {
      update(userRef, data)
    } else {
      set(userRef, data)
    }
  } catch (error) {
    console.error(error)
  }
}

export const onSubscribe = async (authUser, contentUser) => {
  try {
    const authUserRef = databaseRef(database, `users/${authUser.id}`)
    const contentUserRef = databaseRef(database, `users/${contentUser.id}`)

    const authUserSnapshot = await get(authUserRef)
    const contentUserSnapshot = await get(contentUserRef)

    if (authUserSnapshot.exists() && contentUserSnapshot.exists()) {
      const authUserSubscribings = authUserSnapshot.val().subscribings || []
      const contentUserSubscriberss = contentUserSnapshot.val().subscribers || []

      if (
        (!authUserSnapshot.val().subscribings ||
          !authUserSnapshot.val().subscribings.includes(contentUser.id)) &&
        (!contentUserSnapshot.val().subscribers ||
          !contentUserSnapshot.val().subscribers.includes(authUser.id))
      ) {
        await update(authUserRef, {
          subscribings: [...authUserSubscribings, contentUser.id],
        })
        await update(contentUserRef, {
          subscribers: [...contentUserSubscriberss, authUser.id],
        })
      }
    }
  } catch (error) {
    console.error(error)
  }
}

export const onUnsubscribe = async (authUser, contentUser) => {
  try {
    const authUserRef = databaseRef(database, `users/${authUser.id}`)
    const contentUserRef = databaseRef(database, `users/${contentUser.id}`)

    const authUserSnapshot = await get(authUserRef)
    const contentUserSnapshot = await get(contentUserRef)

    if (authUserSnapshot.exists() && contentUserSnapshot.exists()) {
      const authUserSubscribings = authUserSnapshot.val().subscribings || []
      const contentUserSubscribers = contentUserSnapshot.val().subscribers || []

      if (
        (authUserSnapshot.val().subscribings &&
          authUserSnapshot.val().subscribings.includes(contentUser.id)) ||
        (contentUserSnapshot.val().subscribers &&
          contentUserSnapshot.val().subscribers.includes(authUser.id))
      ) {
        const filteredAuthUserSubscribings = authUserSubscribings.filter(
          (user) => user !== contentUser.id
        )
        const filteredContentUserSubscribers = contentUserSubscribers.filter(
          (user) => user !== authUser.id
        )

        await update(authUserRef, {
          subscribings: filteredAuthUserSubscribings,
        })
        await update(contentUserRef, {
          subscribers: filteredContentUserSubscribers,
        })
      }
    }
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
      const ruler = await getUserById(room.ruler)
      return {
        id,
        ...room,
        members: membersWithData,
        messages: messagesWithData,
        ruler,
      }
    } else return false
  } catch (error) {
    console.error(error)
  }
}

export const createRoom = async (id, data) => {
  const roomRef = databaseRef(database, `rooms/${id}`)
  try {
    const snapshot = await get(roomRef)
    if (snapshot.exists()) {
      await update(roomRef, data)
    } else {
      await set(roomRef, data)
      await joinRoom(id, data.owner, data.key)
    }
  } catch (error) {
    console.error(error)
  }
}

export const joinRoom = async (roomId, userId, key) => {
  const roomRef = databaseRef(database, `rooms/${roomId}`)
  try {
    const snapshot = await get(roomRef)
    const members = snapshot.val().members || []
    const type = snapshot.val().type.trim()
    console.log(type)
    if (!members.includes(userId)) {
      if (type === 'private' && key === snapshot.val().key) {
        console.log(true)
        const membersWithUser = [...members, userId]
        await set(roomRef, { ...snapshot.val(), members: membersWithUser })
        const user = await getUserById(userId)
        await sendChatMessage(
          roomId,
          userId,
          `${user.fullname} just joined the channel`,
          'notification'
        )
      } else {
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
    }
  } catch (error) {
    console.error(error)
    return null
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
