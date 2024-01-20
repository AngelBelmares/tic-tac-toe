import { useEffect, useState } from 'react'
import { BoardState, BoardData, Turns, Winner } from '../types'
import { TURNS } from '../constants'
import { getUpdatedData } from '../utils/gameLogic'
import { Socket } from 'socket.io-client'

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

export function useOnlineGame (socket : Socket<ServerToClientEvents, ClientToServerEvents>) {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null))
  const [turn, setTurn] = useState<Turns>(TURNS.X)
  const [winner, setWinner] = useState<Winner>(false)
  const [gameFound, setGameFound] = useState<boolean>(false)
  const [assignedTurn, setAssignedTurn] = useState<string>('')

  useEffect(() => {
    socket.emit('playOnline')

    return () => {
      socket.emit('playerDisconnected')
    }
  }, [])

  useEffect(() => {
    socket.on('recieveMovement', (recievedData) => {
      const { newBoard, newTurn, newWinner } = recievedData
      setBoard(newBoard)
      setTurn(newTurn)
      setWinner(newWinner)
      console.log(recievedData)
    })
    socket.on('resetBoard', () => {
      handleReset()
    })
    socket.on('gameFound', (playerTurn) => {
      setAssignedTurn(playerTurn)
      setGameFound(true)
      console.log(`Your Turn is ${playerTurn} is turn of ${turn}`)
    })
  }, [socket])

  const handleClick = (index: number) => {
    // early return
    if (board[index] !== null || winner || assignedTurn !== turn) return

    const newData = getUpdatedData({ board, turn, index })
    socket.emit('sendMovement', newData)
    console.log('data sent')
  }

  const handleReset = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(false)
    localStorage.removeItem('board')
    localStorage.removeItem('turn')
  }

  return { board, turn, winner, gameFound, assignedTurn, handleClick, handleReset }
}
