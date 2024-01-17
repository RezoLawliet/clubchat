import admin from 'firebase-admin'

import serviceAccount from '@/core/secret.json'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FB_DATABASE_URL,
  })
}

export { admin }
