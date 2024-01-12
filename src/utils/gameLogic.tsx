import { BoardState } from '../types'
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
