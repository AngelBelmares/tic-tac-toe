import './App.css'
import { useState } from 'react'

type Turns = 'X' | 'O';

const TURNS: { [key in Turns]: Turns } = {
  X: 'X',
  O: 'O'
}

type BoardState = Array<string | null>

type SquareProps = {
  children: Turns | null
  index?: number
  selected?: boolean
  handleClick?: (index: number) => void
}

const WINNER_COMBINATIONS = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [2, 4, 6],
  [2, 5, 8],
  [3, 4, 5],
  [6, 7, 8],
  [1, 4, 7]

]

function App () {
  return (
    <main className='h-full w-full flex flex-col justify-center items-center bg-black gap-5'>
      <h1 className='text-3xl text-zinc-200'> Tic-Tac-Toe </h1>
      <Board/>
    </main>
  )
}

function Board () {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null))
  const [turn, setTurn] = useState<Turns>(TURNS.X)
  const [winner, setWinner] = useState<String | boolean>(false)

  const handleClick = (index: number) => {
    if (board[index] !== null || winner) return
    const newBoard = [...board]
    if (turn === TURNS.X) {
      setTurn(TURNS.O)
      newBoard[index] = TURNS.O
    } else {
      setTurn(TURNS.X)
      newBoard[index] = TURNS.X
    }
    setBoard(newBoard)
    const newWinner = checkForWinner(newBoard)
    if (newWinner) {
      console.log(`Winner is ${newWinner}`)
      setWinner(newWinner)
    }
  }

  function checkForWinner (board: BoardState) {
    const combination = WINNER_COMBINATIONS.find(combination => {
      const [a, b, c] = combination
      console.log(board[a], board[b], board[c])
      if (board[a] === board[b] && board[a] === board[c]) {
        return combination
      }
      return undefined
    })
    return combination ? board[combination[0]] : false
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
    </>
  )
}

function Square ({ children, index, selected, handleClick }: SquareProps) {
  return (
    <div className={`h-20 w-20 text-zinc-200 font-bold text-3xl flex items-center justify-center color rounded-xl border-l-zinc-200 border-2 ${selected ? 'bg-rose-600' : ''}`}
        onClick={() => { if (index !== undefined && handleClick) handleClick(index) }}>
      {children}
    </div>
  )
}

export default App
