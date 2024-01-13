import { BoardState, Turns } from '../types'
import { WINNER_COMBINATIONS } from '../constants'

export function checkForWinner (board: BoardState) {
  if (board.every(square => square !== null)) {
    return 'none'
  }
  const combination = WINNER_COMBINATIONS.find(combination => {
    const [a, b, c] = combination
    console.log(board[a], board[b], board[c])
    if (board[a] === board[b] && board[a] === board[c]) {
      return combination
    }
    return undefined
  })
  return combination ? board[combination[0]] : false
}

export function saveToLocalStorage (newBoard: BoardState, newTurn: Turns) {
  localStorage.setItem('board', JSON.stringify(newBoard))
  localStorage.setItem('turn', JSON.stringify(newTurn))
}

export function checkForSavedGame (): [BoardState, Turns] | null[] {
  const savedBoard: BoardState = JSON.parse(localStorage.getItem('board') as string)
  const savedTurn: Turns = JSON.parse(localStorage.getItem('turn') as string)

  return [savedBoard, savedTurn]
}
