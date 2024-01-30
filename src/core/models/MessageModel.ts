import UserType from './UserModel'

type MessageType = {
  owner: UserType
  message: string
  type?: string
  timestamp: number
}

export default MessageType
