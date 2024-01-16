import { useEffect, useState } from 'react'
import { TURNS } from '../constants'
import { BoardState, Turns, Winner, RecievedData } from '../types'
import { Square } from '../components/Square'
import { WinnerModal } from '../components/WinnerModal'
import { getUpdatedData } from '../utils/gameLogic'
import { checkForSavedGame, saveToLocalStorage } from '../utils/localStorage'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3001')

export function Board () {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null))
  const [turn, setTurn] = useState<Turns>(TURNS.X)
  const [winner, setWinner] = useState<Winner>(false)

  useEffect(() => {
    socket.on('recieve_data', (data: RecievedData) => {
      // update the board and change turn
      if ('newBoard' in data && 'newTurn' in data && 'newWinner' in data) {
        const { newBoard, newTurn, newWinner } = data
        setBoard(newBoard)
        setTurn(newTurn)
        setWinner(newWinner)
        saveToLocalStorage(newBoard, newTurn)
      }
    })
  }, [socket])

  const handleClick = (index: number) => {
    // early return
    if (board[index] !== null || winner) return

    const newData = getUpdatedData({ board, turn, index })
    socket.emit('send_data', newData)
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
      <GameList/>
      <CreateGame/>
    </>
  )
}

function CreateGame () {
  const [lobby, setLobby] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: any) => {
    e.preventDefault()

    socket.emit('create_lobby', { lobby, password })

    setLobby('')
    setPassword('')
  }

  return (
    <>
      <form onSubmit={handleSubmit} className='flex flex-col font-medium w-64 text-lg text-slate-200'>
        <label htmlFor="lobby">Enter the lobby name: </label>
        <input
          className='bg-neutral-300'
          type="text"
          name='lobby'
          id='lobby'
          value={lobby}
          onChange={(e) => setLobby(e.target.value)}
        />
        <label htmlFor="password">Enter the password: </label>
        <input
          className='bg-neutral-300'
          type="text"
          name='password'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className='my-5 flex items-center justify-center'>
          <button className='w-max p-1 bg-gray-700' type='submit'>Create a lobby</button>
        </div>
      </form>
    </>
  )
}

function GameList () {
  const [games, setGames] = useState([])

  useEffect(() => {
    socket.on('check_gameslist', (lobbies) => {
      console.log(lobbies)
    })
  }, [socket])

  return (
    <>

    </>
  )
}
