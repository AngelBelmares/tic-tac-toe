import { useEffect, useState } from 'react'
import { TURNS } from '../constants'
import { BoardState, Turns, Winner } from '../types'
import { Square } from '../components/Square'
import { WinnerModal } from '../components/WinnerModal'
import { checkForWinner, saveToLocalStorage, checkForSavedGame, getUpdatedBoard, getNewTurn } from '../utils/gameLogic'

export function Board () {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null))
  const [turn, setTurn] = useState<Turns>(TURNS.X)
  const [winner, setWinner] = useState<Winner>(false)

  const handleClick = (index: number) => {
    // early return
    if (board[index] !== null || winner) return

    // update the board and change turn
    const newBoard = getUpdatedBoard(index, board, turn)
    const newTurn = getNewTurn(turn)

    // set the new state of both
    setTurn(newTurn)
    setBoard(newBoard)

    // check if theres a winner or draw
    const newWinner = checkForWinner(newBoard)
    if (newWinner) {
      setWinner(newWinner as Winner)
    }
    // save to local Storage
    saveToLocalStorage(newBoard, newTurn)
  }

  useEffect(() => {
    const [savedBoard, savedTurn] = checkForSavedGame()
    if (savedBoard) {
      setBoard(savedBoard as BoardState)
      setTurn(savedTurn as Turns)
    }
  }, [])

  const handleReset = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(false)
    localStorage.removeItem('board')
    localStorage.removeItem('turn')
  }

  return (
    <>
      <section className='h-max w-max grid grid-cols-3 gap-2'>
        {board &&
          board.map((square, index) => {
            return <Square
            key={index}
            children={square as Turns}
            index={index}
            handleClick={handleClick}
            />
          })}
      </section>
      <footer className='flex'>
        <Square key={'X'} children={TURNS.X} selected={turn === TURNS.X}/>
        <Square key={'O'} children={TURNS.O} selected={turn === TURNS.O}/>
      </footer>
      {winner &&
        <WinnerModal
          winner={winner}
          handleReset={handleReset}
        />
      }
    </>
  )
}
