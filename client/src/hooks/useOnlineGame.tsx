import { useEffect, useState } from 'react'
import { BoardState, Turns, Winner, ServerToClientEvents, ClientToServerEvents } from '../types'
import { TURNS } from '../constants'
import { getUpdatedData } from '../utils/gameLogic'
import { Socket } from 'socket.io-client'

export function useOnlineGame (socket : Socket<ServerToClientEvents, ClientToServerEvents>, playerID: string) {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null))
  const [turn, setTurn] = useState<Turns>(TURNS.X)
  const [winner, setWinner] = useState<Winner>(false)
  const [gameFound, setGameFound] = useState<boolean>(false)
  const [assignedTurn, setAssignedTurn] = useState<string>('')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    socket.emit('playOnline', playerID)

    return () => {
      socket.emit('playerDisconnected', playerID)
      handleDisconnect()
    }
  }, [])

  useEffect(() => {
    socket.on('recieveMovement', (recievedData) => {
      const { newBoard, newTurn, newWinner } = recievedData
      setBoard(newBoard)
      setTurn(newTurn)
      setWinner(newWinner)
    })
    socket.on('resetBoard', () => {
      handleReset()
    })
    socket.on('gameFound', (playerTurn) => {
      setAssignedTurn(playerTurn)
      setGameFound(true)
    })
    socket.on('winByDefault', (newWinner) => {
      setMessage('Your opponent has left the game')
      setWinner(newWinner)
      handleDisconnect()
    })
  }, [socket])

  const handleClick = (index: number) => {
    // early return
    if (board[index] !== null || winner || assignedTurn !== turn) return

    const newData = getUpdatedData({ board, turn, index })
    socket.emit('sendMovement', newData, playerID)
  }

  const handleReset = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(false)
  }

  const handleDisconnect = () => {
    setGameFound(false)
    setAssignedTurn('')
  }

  return {
    gameStatus: { board, turn, winner, gameFound },
    playerInfo: { assignedTurn, message },
    actions: { handleClick, handleReset }
  }
}
