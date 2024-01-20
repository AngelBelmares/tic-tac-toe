import { useEffect, useState } from 'react'
import { checkForSavedGame, saveToLocalStorage } from '../utils/localStorage'
import { BoardState, Turns, Winner } from '../types'
import { TURNS } from '../constants'
import { getUpdatedData } from '../utils/gameLogic'

export function useLocalGame () {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null))
  const [turn, setTurn] = useState<Turns>(TURNS.X)
  const [winner, setWinner] = useState<Winner>(false)

  useEffect(() => {
    const [savedBoard, savedTurn] = checkForSavedGame()
    if (savedBoard && savedTurn) {
      setBoard(savedBoard)
      setTurn(savedTurn)
    }
  }, [])

  const handleClick = (index: number) => {
    // early return
    if (board[index] !== null || winner) return

    const newData = getUpdatedData({ board, turn, index })
    const { newBoard, newTurn, newWinner } = newData

    saveToLocalStorage(newBoard, newTurn)
    setBoard(newBoard)
    setTurn(newTurn)
    setWinner(newWinner as Winner)
  }

  const handleReset = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(false)
    localStorage.removeItem('board')
    localStorage.removeItem('turn')
  }

  return { board, turn, winner, handleClick, handleReset }
}
