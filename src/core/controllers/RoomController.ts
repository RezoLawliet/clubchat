import UserType from '@/core/models/UserModel'
import RoomType from '@/core/models/RoomModel'
import MessageType from '@/core/models/MessageModel'

import { ref as databaseRef, set } from 'firebase/database'

import { database } from '@/core/firebase'

export const createMessage = async (
  roomId: string,
  ownerId: string,
  message: string,
  type: string | null
) => {
  try {
    const timestamp = Date.now()
    const snapshot = {
      ownerId,
      message,
      ...(type !== null && { type }),
      timestamp: timestamp,
    }
    const messageRef = databaseRef(database, `rooms/${roomId}/messages/${timestamp}`)
    await set(messageRef, snapshot)
  } catch (error) {
    console.error(error)
  }
}
