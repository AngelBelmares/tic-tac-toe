import { TURNS } from '../constants'
import { Turns, OnlineBoardProps, ServerToClientEvents, ClientToServerEvents } from '../types'
import { Square } from './Square'
import { WinnerModal } from './WinnerModal'
import { useOnlineGame } from '../hooks/useOnlineGame'
import { io, Socket } from 'socket.io-client'

export function OnlineBoard ({ playerID }: OnlineBoardProps) {
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3001')

  const { gameStatus, playerInfo, actions } = useOnlineGame(socket, playerID)
  const { board, turn, winner, gameFound } = gameStatus

  return (
    <>
      <h1 className='text-neutral-100'>{playerID}</h1>
      <section className='h-max w-max grid grid-cols-3 gap-2'>
        {board &&
          board.map((square, index) => {
            return <Square
            key={index}
            children={square as Turns}
            index={index}
            handleClick={actions.handleClick}
            />
          })}
      </section>
      <footer className='flex flex-col items-center text-neutral-100'>
        <header className='flex'>
          <Square children={TURNS.X} selected={turn === TURNS.X}/>
          <Square children={TURNS.O} selected={turn === TURNS.O}/>
        </header>
        {gameFound
          ? <span>{playerInfo.assignedTurn === turn
            ? 'Is your Turn'
            : 'Waiting for a movement'}
            </span>
          : <span>Waiting for an opponent</span>
        }
      </footer>

      {winner &&
        <WinnerModal
          winner={winner}
          message={playerInfo.message}
          handleReset={actions.handleReset}
        />
      }

    </>
  )
}
