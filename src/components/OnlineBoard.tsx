import { TURNS } from '../constants'
import { Turns } from '../types'
import { Square } from './Square'
import { WinnerModal } from './WinnerModal'
import { useOnlineGame } from '../hooks/useOnlineGame'
import { io, Socket } from 'socket.io-client'

interface ServerToClientEvents {
  playOnline: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

export function OnlineBoard () {
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3001')

  const { board, turn, winner, gameFound, assignedTurn, handleClick, handleReset } = useOnlineGame(socket)

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
      <footer className='flex flex-col items-center text-neutral-100'>
        <header className='flex'>
          <Square key={'X'} children={TURNS.X} selected={turn === TURNS.X}/>
          <Square key={'O'} children={TURNS.O} selected={turn === TURNS.O}/>
        </header>
        {gameFound
          ? <span>{assignedTurn === turn
            ? 'Is your Turn'
            : 'Waiting for a movement'}
            </span>
          : <span>Waiting for an opponent</span>
        }
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
