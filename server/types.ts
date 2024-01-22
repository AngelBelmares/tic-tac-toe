import { UUID } from 'crypto'

export type Turns = 'X' | 'O';
export type BoardState = Array<string | null>
export type Winner = 'X' | 'O' | 'none' | false | null

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

export type Lobby ={
  lobbyID: UUID
  playerX: string | undefined,
  playerO: string | undefined,
}