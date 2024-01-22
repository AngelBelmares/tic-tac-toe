export type Turns = 'X' | 'O';

export type BoardState = Array<string | null>
export type Winner = 'X' | 'O' | 'none' | false | null

export type WinnerModalProps = {
  winner: Winner
  message?: string | null
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

export type BoardData = {
  newBoard: BoardState
  newTurn: Turns
  newWinner: Winner
}

export interface ServerToClientEvents {
  recieveMovement: (recievedData: BoardData) => void
  resetBoard: () => void
  gameFound: (playerTurn: Turns) => void
  winByDefault: (newWinner: Winner) => void
}

export interface ClientToServerEvents {
  playOnline: (playerID: string) => void
  playerDisconnected: (playerID: string) => void
  sendMovement: (newData: BoardData, playerID: string) => void
}

export type OnlineBoardProps = {
  playerID: string
}
