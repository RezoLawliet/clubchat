import UserType from './UserModel'
import MessageType from './MessageModel'

type RoomType = {
  id: string
  topic: string
  type: string
  key?: string
  members: UserType[]
  messages: MessageType[]
  ruler: UserType
  timestamp: number
}

export default RoomType
