import { Square } from './Square'
import { WinnerModalProps } from '../types'

export function WinnerModal ({ winner, message, handleReset }: WinnerModalProps) {
  return (
    <div className='flex flex-col justify-around items-center absolute left-auto right-auto w-96 h-96 text-slate-200 bg-gray-900 opacity-95 rounded-xl'>
      <h1 className='text-3xl'>Winner is: </h1>
      <Square
        children={winner}
        />
        <p>{message}</p>
      <button onClick={handleReset} className='border-2 px-2 py-2'>Restart Game</button>
    </div>
  )
}
