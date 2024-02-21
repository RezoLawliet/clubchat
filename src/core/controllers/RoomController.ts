import UserType from '@/core/models/UserModel'
import RoomType from '@/core/models/RoomModel'
import MessageType from '@/core/models/MessageModel'

import { ref as databaseRef, get, orderByKey, query, remove, set, update } from 'firebase/database'

import { database, getUserById } from '@/core/firebase'

export const createRoom = async (roomId: string, content: any) => {
  const roomRef = databaseRef(database, `rooms/${roomId}`)
  try {
    const snapshot = await get(roomRef)
    if (snapshot.exists()) {
      await update(roomRef, content)
    } else {
      await set(roomRef, content)
      await joinRoom(roomId, content.ruler, content.key)
    }
  } catch (error) {
    console.error(error)
  }
}

export const joinRoom = async (roomId: any, userId: any, key?: string) => {
  const roomRef = databaseRef(database, `rooms/${roomId}`)
  try {
    const snapshot = await get(roomRef)
    const members = snapshot.val().members || []
    const type = snapshot.val().type.trim()
    console.log(type)
    if (!members.includes(userId)) {
      if (type === 'private' && key === snapshot.val().key) {
        const membersWithUser = [...members, userId]
        await set(roomRef, { ...snapshot.val(), members: membersWithUser })
        const user = await getUserById(userId)
        await createMessage(
          roomId,
          userId,
          `${user.fullname} just joined the channel`,
          'notification'
        )
      } else {
        const membersWithUser = [...members, userId]
        await set(roomRef, { ...snapshot.val(), members: membersWithUser })
        const user = await getUserById(userId)
        await createMessage(
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

export const leaveRoom = async (roomId: string, userId: string) => {
  const roomRef = databaseRef(database, `rooms/${roomId}`)
  try {
    const snapshot = await get(roomRef)
    if (snapshot.exists()) {
      const room = snapshot.val()
      const members = room.members || []
      if (members.length <= 1 && members.includes(userId)) {
        await remove(roomRef)
      } else if (members.includes(userId)) {
        const membersWithoutUser = members.filter((memberId: string) => memberId !== userId)
        await set(roomRef, { ...room, members: membersWithoutUser })
        const user = await getUserById(userId)
        await createMessage(
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

export const removeRoom = async (roomId: string) => {
  const roomRef = databaseRef(database, `rooms/${roomId}`)
  try {
    const snapshot = await get(roomRef)
    if (snapshot.exists()) {
      await remove(roomRef)
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
            ? await Promise.all(room.members.map((member: string) => getUserById(member)))
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

export const getRoomById = async (roomId: any) => {
  const roomRef = databaseRef(database, `rooms/${roomId}`)
  try {
    const snapshot = await get(roomRef)
    if (snapshot.exists()) {
      const room = snapshot.val()
      const members = room.members
        ? await Promise.all(room.members.map((member: string) => getUserById(member)))
        : []
      const membersWithData = members.filter(Boolean)
      const messages = room.messages ? Object.values(room.messages) : []
      const senders = Array.from(new Set(messages.map((message: any) => message.owner)))
      const sendersWithData = await Promise.all(senders.map((sender) => getUserById(sender)))
      const messagesWithData = messages.map((message: any) => {
        const messageWithSenders = sendersWithData.find((user) => user.id === message.owner)
        const { owner, ...rest } = message
        return { owner: messageWithSenders, ...rest }
      })
      const ruler = await getUserById(room.ruler)
      return {
        roomId,
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

export const createMessage = async (
  roomId: string,
  ownerId: string,
  message: string,
  type?: string | null
) => {
  try {
    const timestamp = Date.now()
    const snapshot = {
      owner: ownerId,
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
