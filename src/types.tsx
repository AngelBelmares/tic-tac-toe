export type Turns = 'X' | 'O';

export type BoardState = Array<string | null>
export type Winner = 'X' | 'O' | 'none' | false

export type WinnerModalProps = {
  winner: Winner
  handleReset: () => void
}

export type SquareProps = {
  children: Turns | Winner
  index?: number
  selected?: boolean
  handleClick?: (index: number) => void
}

export type Data = {
  index: number,
  board: BoardState,
  turn: Turns
}

export type RecievedData = {
  newBoard: BoardState
  newTurn: Turns
  newWinner: Winner
}
