import { BoardState, Turns } from '../types'

export function saveToLocalStorage (newBoard: BoardState, newTurn: Turns) {
  localStorage.setItem('board', JSON.stringify(newBoard))
  localStorage.setItem('turn', JSON.stringify(newTurn))
}

export function checkForSavedGame (): [BoardState, Turns] | null[] {
  const savedBoard: BoardState = JSON.parse(localStorage.getItem('board') as string)
  const savedTurn: Turns = JSON.parse(localStorage.getItem('turn') as string)

  return [savedBoard, savedTurn]
}
