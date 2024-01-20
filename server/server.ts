import http from 'http'
import { Server } from 'socket.io'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())

const server = http.createServer(app)

export type Turns = 'X' | 'O';

export type BoardState = Array<string | null>
export type Winner = 'X' | 'O' | 'none' | false | null

export type WinnerModalProps = {
  winner: Winner
  handleReset: () => void
}

export type SquareProps = {
  children: Turns | Winner
  index?: number
  selected?: boolean
  handleClick?: (index: number) => void
}

export type Data = {
  index: number,
  board: BoardState,
  turn: Turns
}

export type BoardData = {
  newBoard: BoardState
  newTurn: Turns
  newWinner: Winner
}

interface ServerToClientEvents {
  recieveMovement: (recievedData: BoardData) => void
  resetBoard: () => void
  gameFound: (playerTurn: Turns) => void
}

interface ClientToServerEvents {
  playOnline: () => void
  playerDisconnected: () => void
  sendMovement: (newData: BoardData) => void
}

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

const players: string[] = []

io.on('connection', (socket) => {
  console.log(players)
  console.log(`User connected: ${socket.id}`)

  socket.on('playOnline', () => {
    console.log(`${socket.id} is playing online`)
    players.push(socket.id)
    console.log(`${players.length} are playing`)

    socket.join('room1')
    if (players.length === 2) {
      console.log(`${players[0]} is playing agains ${players[1]}`)
      io.to(players[0]).emit('gameFound', 'X')
      io.to(players[1]).emit('gameFound', 'O')
    }
  })

  socket.on('sendMovement', (data): void => {
    console.log('hi')
    console.log('data received', data)
    io.emit('recieveMovement', data)
    console.log('Sending Data' + data)
  })

  socket.on('playerDisconnected', () => {
    console.log(`${socket.id} is leaving the game`)
    io.to(socket.id).emit('resetBoard')
    socket.leave('room1')

    const index = players.indexOf(socket.id)
    if (index !== -1) {
      players.splice(index, 1)
    }
    console.log(`${players} are playing`)
  })
})

server.listen(3001, () => {
  console.log('Server is running')
})
