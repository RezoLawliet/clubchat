import dotenv from 'dotenv'
import { initializeApp } from 'firebase/app'

dotenv.config({
  path: 'server/.env',
})

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
  appId: process.env.FB_APP_ID,
}

const app = initializeApp(firebaseConfig)

export default app
