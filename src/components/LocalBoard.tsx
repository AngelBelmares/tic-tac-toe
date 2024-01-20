import { TURNS } from '../constants'
import { Turns } from '../types'
import { Square } from './Square'
import { WinnerModal } from './WinnerModal'
import { useLocalGame } from '../hooks/useLocalGame'

export function LocalBoard () {
  const { board, turn, winner, handleClick, handleReset } = useLocalGame()

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
