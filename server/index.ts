import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'

dotenv.config({
  path: 'server/.env',
})

import firebase from './core/firebase'

const app = express()

app.use(cors())

const fileLoader = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/avatars/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
    },
  }),
})

firebase

app.get('/', (req, res) => {
  res.send('Hello')
})

app.post('/upload', fileLoader.single('photo'), (req, res) => {
  res.json({
    url: `/avatars/${req.file?.filename}`,
  })
})

app.listen(5000, () => {
  console.log('Server is working...')
  console.log(firebase)
})
