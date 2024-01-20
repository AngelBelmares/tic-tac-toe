import http from 'http'
import { Server } from 'socket.io'
import express from 'express'
import cors from 'cors'
import { UUID, randomUUID } from 'crypto'
import { Socket } from 'socket.io-client'

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
  playOnline: (playerID: string) => void
  playerDisconnected: () => void
  sendMovement: (newData: BoardData, playerID: string) => void
}

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

type Lobby ={
  lobbyID: UUID
  playerX: string | undefined,
  playerO: string | undefined,
}

const lobbies: Lobby[] = []
const playerToSocket = new Map<string, string>()

io.on('connection', (socket) => {
  socket.on('playOnline', (playerID: string) => {
    console.log(`${playerID} is playing online`)

    playerToSocket.set(playerID, socket.id)

    const lobbyID = checkForLobby(lobbies, playerID)

    if (lobbyID) {
      socket.join(lobbyID)
    }
    const currentLobby = lobbies.find(lobby => {
      return lobby.playerO === playerID || lobby.playerX === playerID
    })

    if (currentLobby) {
      const { playerX, playerO } = currentLobby
      if (playerX && playerO) {
        console.log('Creating Game')
        // Look up the socket IDs using the player IDs
        const socketIdX = playerToSocket.get(playerX)
        const socketIdO = playerToSocket.get(playerO)
        if (socketIdX) {
          io.to(socketIdX).emit('gameFound', 'X')
        }
        if (socketIdO) {
          io.to(socketIdO).emit('gameFound', 'O')
        }
      }
    }
  })

  socket.on('sendMovement', (data, playerID): void => {
    console.log('Movement Sent')
    console.log('Player ID:', playerID)
    console.log('Lobbies:', lobbies)
    const currentLobby = lobbies.find(lobby => {
      return lobby.playerO === playerID || lobby.playerX === playerID
    })
    console.log(`Movement in ${currentLobby} lobby`)
    if (currentLobby) {
      io.in(currentLobby.lobbyID).emit('recieveMovement', data)
    }
  })

  socket.on('playerDisconnected', () => {
    console.log(`${socket.id} is leaving the game`)
    socket.to(socket.id).emit('resetBoard')

    const currentLobby = lobbies.find(lobby => {
      return lobby.playerO === socket.id || lobby.playerX === socket.id
    })

    if (currentLobby) {
      if (currentLobby.playerX === socket.id) {
        currentLobby.playerX = undefined
      } else if (currentLobby.playerO === socket.id) {
        currentLobby.playerO = undefined
      }
    }

    socket.leave(currentLobby?.lobbyID as string)
  })
})

function checkForLobby (lobbies: Lobby[], playerID: string): UUID {
  console.log(lobbies)
  const userAlreadyInLobby = lobbies.find(lobby => {
    return lobby.playerO === playerID || lobby.playerX === playerID
  })

  if (userAlreadyInLobby) return userAlreadyInLobby.lobbyID

  const availableLobby = lobbies.find((lobby) => {
    console.log(`${lobby.playerX}  ${lobby.playerO}`)
    return lobby.playerX === undefined || lobby.playerO === undefined
  })

  if (availableLobby) {
    console.log('Found Available lobby')
    if (!availableLobby.playerX) {
      availableLobby.playerX = playerID
    } else if (!availableLobby.playerO) {
      availableLobby.playerO = playerID
    }
    return availableLobby.lobbyID
  } else {
    console.log('creating new lobby')
    const newLobby: Lobby = {
      lobbyID: randomUUID(),
      playerX: playerID,
      playerO: undefined
    }
    lobbies.push(newLobby)
    return newLobby.lobbyID
  }
}

server.listen(3001, () => {
  console.log('Server is running')
})
