import { SquareProps } from '../types'

export function Square ({ children, index, selected, handleClick }: SquareProps) {
  return (
    <div className={`h-20 w-20 text-zinc-200 font-bold text-3xl flex items-center justify-center color rounded-xl border-l-zinc-200 border-2 ${selected ? 'bg-rose-600' : ''}`}
        onClick={() => { if (index !== undefined && handleClick) handleClick(index) }}>
      {children}
    </div>
  )
}
