import { useState } from 'react'
import { TURNS } from '../constants'
import { BoardState, Turns, Winner } from '../types'
import { Square } from '../components/Square'
import { WinnerModal } from '../components/WinnerModal'
import { checkForWinner } from '../utils/gameLogic'

export function Board () {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null))
  const [turn, setTurn] = useState<Turns>(TURNS.X)
  const [winner, setWinner] = useState<Winner>(false)

  const handleClick = (index: number) => {
    // early return
    if (board[index] !== null || winner) return
    const newBoard = [...board]

    // change turn and update the board
    if (turn === TURNS.X) {
      setTurn(TURNS.O)
      newBoard[index] = TURNS.O
    } else {
      setTurn(TURNS.X)
      newBoard[index] = TURNS.X
    }
    setBoard(newBoard)

    // check if theres a winner or draw
    const newWinner = checkForWinner(newBoard)
    if (newWinner) {
      setWinner(newWinner as Winner)
    }
  }

  const handleReset = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(false)
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
      <section className='flex'>
        <Square key={'X'} children={TURNS.X} selected={turn === TURNS.X}/>
        <Square key={'O'} children={TURNS.O} selected={turn === TURNS.O}/>
      </section>
      {winner &&
        <WinnerModal
          winner={winner}
          handleReset={handleReset}
        />
      }
    </>
  )
}
