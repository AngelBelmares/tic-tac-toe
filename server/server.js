import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
app.use(cors())

const server = http.createServer(app)
const lobbies = new Map()

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)

  socket.on('send_data', (data) => {
    console.log(data)
    io.emit('recieve_data', data)
  })

  socket.on('create_lobby', ({ lobby, password }) => {
    lobbies.set(lobby, { password, users: [socket.id] })

    socket.join(lobby)
    io.emit('check_gameslist', lobbies)
  })

  socket.on()
})

server.listen(3001, () => {
  console.log('Server is running')
})
